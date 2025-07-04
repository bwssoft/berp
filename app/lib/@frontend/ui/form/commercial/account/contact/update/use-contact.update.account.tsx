"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/app/lib/@frontend/hook";
import { useRouter, useSearchParams } from "next/navigation";
import { IContact } from "@/app/lib/@backend/domain";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContactItem, ContactType } from "../create";
import {
  findManyAccount,
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import { updateOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { useState } from "react";

const validatePhoneNumber = (value: string) => {
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
          if (!validatePhoneNumber(item.contact)) {
            ctx.addIssue({
              code: "custom",
              path: ["contactItems", index, "contact"],
              message:
                "Telefone deve conter apenas números e no máximo 11 dígitos",
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
  closeModal: () => void,
  contact: IContact
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
    register,
    watch,
    setError,
    reset,
    handleSubmit,
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

  const queryClient = useQueryClient();
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const { success, error } = await updateOneContact(
      { id: contact.id },
      {
        ...data,
        accountId: accountId ?? undefined,
        contactItems: data.contactItems.map((item) => ({
          ...item,
          id: item.id ?? crypto.randomUUID(),
          type: item.type[0],
        })),
      }
    );
    if (success) {
      if (accountId) {
        const freshAccount = await findOneAccount({ id: accountId });
        const currentContacts: IContact[] = freshAccount?.contacts ?? [];

        const updatedContact = { ...success, id: contact.id };

        const uniqueContacts = new Map<string, IContact>();
        currentContacts.forEach((c) => {
          if (c?.id) {
            if (c.id === contact.id) {
              uniqueContacts.set(c.id, updatedContact);
            } else {
              uniqueContacts.set(c.id, c);
            }
          }
        });

        if (!uniqueContacts.has(contact.id)) {
          uniqueContacts.set(contact.id, updatedContact);
        }

        const updatedContacts = Array.from(uniqueContacts.values());

        await updateOneAccount(
          { id: accountId },
          { contacts: updatedContacts }
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["findOneAccount", accountId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["findManyAccount", accountId],
      });

      toast({
        title: "Sucesso!",
        description: "Contato atualizado com sucesso!",
        variant: "success",
      });

      reset();
      closeModal();
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
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o contato.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
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
    isLoading,
  };
}
