"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  maskPhoneNumber,
  unmaskPhoneNumber,
} from "@/app/lib/util/mask-phone-number";

import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useSearchParams } from "next/navigation";
import { IContact } from "@/app/lib/@backend/domain";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  findManyAccount,
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { createOneContact } from "@/app/lib/@backend/action/commercial/contact.action";

// Define the preferred contact interface
export interface PreferredContact {
  phone?: boolean;
  whatsapp?: boolean;
  email?: boolean;
}

// Define the contact type union
export type ContactType =
  | "Celular"
  | "Telefone Residencial"
  | "Telefone Comercial"
  | "Email";

// Define the contact item interface
export interface ContactItem {
  id?: string;
  type: ContactType[];
  contact: string;
  preferredContact: PreferredContact;
}

// Phone validation helper function
const validatePhoneNumber = (value: string) => {
  const numericValue = unmaskPhoneNumber(value);
  const isCellphone = numericValue.length === 11;
  const isLandline = numericValue.length === 10;
  return isCellphone || isLandline;
};

const schema = z
  .object({
    contractEnabled: z.boolean(),
    name: z.string().min(1, "Nome é obrigatório"),
    positionOrRelation: z.string().min(1, "Cargo ou relação é obrigatório"),
    department: z.string().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    contactFor: z
      .array(z.enum(["Faturamento", "Marketing", "Suporte", "Comercial"]))
      .min(1, "Contato para é obrigatório"),
    contactItems: z
      .array(
        z.object({
          id: z.string().optional(),
          type: z.array(
            z.enum([
              "Celular",
              "Telefone Residencial",
              "Telefone Comercial",
              "Email",
            ])
          ),
          contact: z.string().min(1, "Adicione ao menos um contato"),
          preferredContact: z.object({
            phone: z.boolean().optional(),
            whatsapp: z.boolean().optional(),
            email: z.boolean().optional(),
          }),
        })
      )
      .min(1, "Adicione ao menos um contato"),
  })
  .superRefine((data, ctx) => {
    // CPF validation for contracts
    if (data.contractEnabled) {
      if (!data.cpf) {
        ctx.addIssue({
          code: "custom",
          path: ["cpf"],
          message: "CPF é obrigatório quando contrato está habilitado",
        });
      } else if (!isValidCPF(data.cpf)) {
        ctx.addIssue({
          code: "custom",
          path: ["cpf"],
          message: "Documento inválido!",
        });
      }
    }

    // Validate all contact items
    if (data.contactItems && data.contactItems.length > 0) {
      data.contactItems.forEach((item, index) => {
        const contactType = item.type?.[0];

        // Validate phone numbers
        if (
          ["Celular", "Telefone Residencial", "Telefone Comercial"].includes(
            contactType
          )
        ) {
          const numericValue = unmaskPhoneNumber(item.contact);
          const isCellphone =
            contactType === "Celular" && numericValue.length !== 11;
          const isLandline =
            (contactType === "Telefone Residencial" ||
              contactType === "Telefone Comercial") &&
            numericValue.length !== 10;

          if (isCellphone || isLandline) {
            ctx.addIssue({
              code: "custom",
              path: ["contactItems", index, "contact"],
              message:
                contactType === "Celular"
                  ? "Celular deve ter 11 dígitos (incluindo DDD)"
                  : "Telefone deve ter 10 dígitos (incluindo DDD)",
            });
          }
        }

        // Validate email
        if (contactType === "Email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(item.contact)) {
            ctx.addIssue({
              code: "custom",
              path: ["contactItems", index, "contact"],
              message: "Email inválido",
            });
          }
        }
      });
    }
  });

export type ContactFormSchema = z.infer<typeof schema>;

// Extended interface for submit function that includes originType
export type ContactFormSchemaWithOrigin = ContactFormSchema & {
  originType: "api" | "local";
};

export function useCreateContactAccount(
  closeModal: () => void,
  onSubmit: (
    data: ContactFormSchemaWithOrigin,
    accountId?: string
  ) => Promise<void>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [tempContact, setTempContact] = useState<{
    type: ContactType | "";
    contact: string;
    preferredContact: PreferredContact;
  }>({
    type: "",
    contact: "",
    preferredContact: {},
  });
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      contractEnabled: false,
      name: "",
      positionOrRelation: "",
      department: "",
      cpf: "",
      rg: "",
      contactFor: [],
      contactItems: [],
    },
  });

  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");

  const {
    control,
    setError,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "contactItems",
  });

  const handleNewContact = () => {
    if (!tempContact.type || !tempContact.contact) {
      toast({
        title: "Atenção",
        description: "Preencha o tipo e o contato antes de adicionar.",
        variant: "error",
      });
      return;
    }

    // Validate phone numbers
    if (
      ["Celular", "Telefone Residencial", "Telefone Comercial"].includes(
        tempContact.type
      )
    ) {
      const numericValue = unmaskPhoneNumber(tempContact.contact);
      const isCellphone =
        tempContact.type === "Celular" && numericValue.length !== 11;
      const isLandline =
        (tempContact.type === "Telefone Residencial" ||
          tempContact.type === "Telefone Comercial") &&
        numericValue.length !== 10;

      if (isCellphone || isLandline) {
        toast({
          title: "Formato inválido",
          description:
            tempContact.type === "Celular"
              ? "Celular deve ter 11 dígitos (incluindo DDD)"
              : "Telefone deve ter 10 dígitos (incluindo DDD)",
          variant: "error",
        });
        return;
      }
    }

    // Validate email
    if (tempContact.type === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(tempContact.contact)) {
        toast({
          title: "Formato inválido",
          description: "Formato de email inválido",
          variant: "error",
        });
        return;
      }
    }

    // Store contact with mask applied if it's a phone
    const formattedContact = [
      "Celular",
      "Telefone Residencial",
      "Telefone Comercial",
    ].includes(tempContact.type as string)
      ? maskPhoneNumber(tempContact.contact, tempContact.type as string)
      : tempContact.contact;

    append({
      id: crypto.randomUUID(),
      type: Array.isArray(tempContact.type)
        ? tempContact.type
        : [tempContact.type],
      contact: formattedContact,
      preferredContact: tempContact.preferredContact,
    });

    // Reset temp contact after adding
    setTempContact({
      type: "",
      contact: "",
      preferredContact: {},
    });
  };

  const handlePreferredContact = (
    index: number,
    key: keyof PreferredContact
  ) => {
    const item = fields[index];
    update(index, {
      ...item,
      preferredContact: {
        ...item.preferredContact,
        [key]: !item.preferredContact?.[key as keyof PreferredContact],
      },
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleSubmit = hookFormSubmit(
    async (data) => {
      setIsLoading(true);

      await onSubmit({ ...data, originType: "local" }, accountId || undefined);

      setIsLoading(false);
    },
    () => {}
  );

  const handleCheckboxChange = (
    fieldValue: string[] = [],
    label: string,
    checked: boolean
  ) => {
    if (checked) {
      return fieldValue.includes(label) ? fieldValue : [...fieldValue, label];
    } else {
      return fieldValue.filter((item) => item !== label);
    }
  };

  return {
    ...methods,
    fields,
    handleNewContact,
    handlePreferredContact,
    handleRemove,
    handleSubmit,
    setTempContact,
    tempContact,
    handleCheckboxChange,
    isLoading,
  };
}
