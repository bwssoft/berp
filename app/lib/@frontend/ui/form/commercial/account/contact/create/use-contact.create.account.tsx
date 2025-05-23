"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createOneContact,
  findManyAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { useSearchParams } from "next/navigation";
import { IContact } from "@/app/lib/@backend/domain";
import { useQuery } from "@tanstack/react-query";

export type ContactList = {
  id?: string;
  type: string[];
  contact: string;
  preferredContact: {
    phone?: boolean;
    whatsapp?: boolean;
    email?: boolean;
  };
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
  });

export function useCreateContactAccount(closeModal: () => void) {
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

  const handleNewContact = () => {
    const rawType = watch("contactItems.0.type");
    const type =
      Array.isArray(rawType) && rawType.length > 0
        ? rawType[0]
        : typeof rawType === "string"
          ? rawType
          : "Celular";

    const contact = watch("contactItems.0.contact")?.trim();
    if (!type || !contact) {
      toast({
        title: "Atenção",
        description: "Preencha o tipo e o contato antes de adicionar.",
        variant: "error",
      });
      return;
    }

    append({
      id: crypto.randomUUID(),
      type: [type],
      contact,
      preferredContact: {},
    });
  };

  const handlePreferredContact = (
    index: number,
    key: keyof ContactList["preferredContact"]
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

  const onSubmit = handleSubmit(async (data) => {
    const { success, error } = await createOneContact({
      ...data,
      accountId: accountId ?? undefined,
      contactItems: data.contactItems.map((item) => ({
        ...item,
        id: item.id ?? crypto.randomUUID(),
        type: item.type[0],
      })),
    });

    if (success && accountId) {
      try {
        const currentContacts: IContact[] =
          accountData?.docs?.[0]?.contacts ?? [];

        const updatedContacts: IContact[] = [
          ...currentContacts,
          ...(success ? [success] : []),
        ].filter(
          (contact, index, self) =>
            contact?.id && index === self.findIndex((c) => c?.id === contact.id)
        );

        await updateOneAccount(
          { id: accountId },
          { contacts: updatedContacts }
        );

        toast({
          title: "Sucesso!",
          description: "Contato criado e conta atualizada com sucesso!",
          variant: "success",
        });

        reset();
        closeModal();
      } catch (err) {
        console.log(err);
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
  };
}
