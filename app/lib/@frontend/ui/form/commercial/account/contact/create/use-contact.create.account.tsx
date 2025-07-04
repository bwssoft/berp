"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "@/app/lib/@frontend/hook";
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
  // Check if it's only numbers and max 11 digits (for Brazilian numbers)
  return /^\d{0,11}$/.test(value);
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
          if (!validatePhoneNumber(item.contact)) {
            ctx.addIssue({
              code: "custom",
              path: ["contactItems", index, "contact"],
              message:
                "Telefone deve conter apenas números e no máximo 11 dígitos",
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

export function useCreateContactAccount(closeModal: () => void) {
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
    handleSubmit,
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
      if (!validatePhoneNumber(tempContact.contact)) {
        toast({
          title: "Formato inválido",
          description:
            "Telefone deve conter apenas números e no máximo 11 dígitos",
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

    append({
      id: crypto.randomUUID(),
      type: Array.isArray(tempContact.type)
        ? tempContact.type
        : [tempContact.type],
      contact: tempContact.contact,
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

  const queryClient = useQueryClient();

  const onSubmit = handleSubmit(async (data) => {
    const { success, error } = await createOneContact({
      ...data,
      accountId: accountId ?? undefined,
      contractEnabled: data.contractEnabled ? true : false,
      contactItems:
        data.contactItems?.map((item) => ({
          ...item,
          contact: item.contact,
          type: Array.isArray(item.type) ? item.type[0] : item.type,
          id: item.id ?? crypto.randomUUID(),
        })) || [],
    });

    if (success && accountId) {
      const freshAccount = await findOneAccount({ id: accountId });
      const currentContacts: IContact[] = freshAccount?.contacts ?? [];

      const uniqueContacts = new Map<string, IContact>();
      [...currentContacts, success].forEach((c) => {
        if (c?.id) uniqueContacts.set(c.id, c);
      });

      const updatedContacts = Array.from(uniqueContacts.values());

      try {
        await updateOneAccount(
          { id: accountId },
          { contacts: updatedContacts }
        );

        await queryClient.invalidateQueries({
          queryKey: ["findOneAccount", accountId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["findManyAccount", accountId],
        });

        toast({
          title: "Sucesso!",
          description: "Contato criado e conta atualizada com sucesso!",
          variant: "success",
        });

        reset();
        closeModal();
      } catch (err) {
        console.error(err);
        toast({
          title: "Erro ao atualizar conta!",
          description: "O contato foi criado, mas a conta não foi atualizada.",
          variant: "error",
        });
      }
    } else if (error) {
      Object.entries(error).forEach(([key, msg]) => {
        if (key !== "global" && msg) {
          setError(key as any, { type: "manual", message: msg as string });
        }
      });
      if (error.global) {
        toast({ title: "Erro!", description: error.global, variant: "error" });
      }
    }
  });

  return {
    ...methods,
    fields,
    handleNewContact,
    handlePreferredContact,
    handleRemove,
    onSubmit,
    setTempContact,
  };
}
