"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { findManyAccount, updateOneContact } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { useRouter, useSearchParams } from "next/navigation";
import { IContact } from "@/app/lib/@backend/domain";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContactList } from "../create";

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

export function useUpdateContactAccount(
  closeModal: () => void,
  contact: IContact
) {
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

  const queryClient = useQueryClient();
  const onSubmit = handleSubmit(async (data) => {
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
      await queryClient.invalidateQueries({
        queryKey: ["findOneAccount", accountId],
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
