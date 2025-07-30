"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { IContact } from "@/app/lib/@backend/domain";
import { maskPhoneNumber } from "@/app/lib/util/mask-phone-number";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  findManyAccount,
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { updateOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { ContactItem, ContactType } from "../create";

const schema = z
  .object({
    contractEnabled: z.boolean(),
    name: z.string().min(1, "Nome é obrigatório"),
    positionOrRelation: z.string().min(1, "Cargo ou relação é obrigatório"),
    department: z.string().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    contactFor: z
      .array(z.enum(["Faturamento", "Marketing", "Suporte", "Comercial", "Fiscal"]))
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
      .min(1, "Adicione ao menos um tipo de contato"),
  })
  .superRefine((data, ctx) => {
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

    if (data.contactItems && data.contactItems.length > 0) {
      data.contactItems.forEach((item, index) => {
        const contactType = item.type?.[0];

        if (
          ["Celular", "Telefone Residencial", "Telefone Comercial"].includes(
            contactType
          )
        ) {
          const numericValue = item.contact.replace(/[^0-9]/g, "");
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

export function useUpdateContactAccount(
  contact: IContact,
  onSubmit: (data: any, contact: IContact, accountId?: string) => Promise<void>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [tempContact, setTempContact] = useState<{
    type: ContactType | "";
    contact: string;
    preferredContact: {
      phone?: boolean;
      whatsapp?: boolean;
      email?: boolean;
    };
  }>({
    type: "",
    contact: "",
    preferredContact: {},
  });

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      contractEnabled: contact.contractEnabled,
      name: contact.name,
      positionOrRelation: contact.positionOrRelation,
      department: contact.department,
      cpf: contact.cpf,
      rg: contact.rg,
      contactFor: contact.contactFor,
      contactItems: contact.contactItems.map((item) => ({
        id: item.id,
        type: Array.isArray(item.type)
          ? item.type
          : [item.type].filter(Boolean),
        contact: item.contact,
        preferredContact: item.preferredContact,
      })),
    },
  });

  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");

  const {
    control,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "contactItems",
  });

  const router = useRouter();

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
      const numericValue = tempContact.contact.replace(/[^0-9]/g, "");
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

    setTempContact({
      type: "",
      contact: "",
      preferredContact: {},
    });
  };

  const handlePreferredContact = (
    index: number,
    key: keyof ContactItem["preferredContact"]
  ) => {
    const item = fields[index];
    update(index, {
      ...item,
      preferredContact: {
        ...item.preferredContact,
        [key]: !item.preferredContact?.[key],
      },
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const { data: accountData } = useQuery({
    queryKey: ["findManyAccount", accountId],
    queryFn: () => {
      if (!accountId) {
        return null;
      } else {
        return findManyAccount({ id: accountId });
      }
    },
    enabled: !!accountId,
  });

  const handleSubmit = hookFormSubmit(
    async (data) => {
      setIsLoading(true);

      await onSubmit(data, contact, accountId || undefined);

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
    isLoading,
    handleCheckboxChange,
    tempContact,
  };
}
