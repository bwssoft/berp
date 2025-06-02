"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IAccount, ICnpjaResponse } from "@/app/lib/@backend/domain";
import {
  createOneAccount,
  accountExists,
} from "@/app/lib/@backend/action/commercial/account.action";
import { Schema, z } from "zod";
import {
  createOneAddress,
  createOneContact,
  fetchCnpjData,
  fetchNameData,
} from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    document: z.object({
      value: z.string(),
      type: z.enum(["cpf", "cnpj"]),
    }),
    cpf: z
      .object({
        name: z
          .string()
          .min(1, "Nome completo é obrigatório")
          .refine((val) => val.trim().split(/\s+/).length >= 2, {
            message: "Informe o nome completo",
          }),
        rg: z
          .string()
          .regex(/^[\d./-]*$/, {
            message: "RG deve conter apenas números, pontos, barras e hífens",
          })
          .optional(),
      })
      .optional(),
    cnpj: z
      .object({
        social_name: z.string().min(1, "Razão social é obrigatória"),
        fantasy_name: z.string().optional(),
        state_registration: z.string().optional(),
        municipal_registration: z.string().optional(),
        status: z.string().optional(),
        sector: z.string().min(1, "Setor obrigatório"),
        economic_group_holding: z.string().optional(),
        economic_group_controlled: z.array(z.string()).optional(),
      })
      .optional(),
    contact: z.any().optional(),
    address: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    const type = data.document.type;

    if (type === "cpf") {
      if (!data.cpf) {
        ctx.addIssue({
          path: ["cpf"],
          code: z.ZodIssueCode.custom,
          message: "Dados de CPF são obrigatórios",
        });
        return;
      }
      if (!data.cpf.name || data.cpf.name.trim().length < 1) {
        ctx.addIssue({
          path: ["cpf", "name"],
          code: z.ZodIssueCode.custom,
          message:
            "Nome completo é obrigatório e deve ter ao menos duas palavras",
        });
      }
    }

    if (type === "cnpj") {
      if (!data.cnpj) {
        ctx.addIssue({
          path: ["cnpj"],
          code: z.ZodIssueCode.custom,
          message: "Dados de CNPJ são obrigatórios",
        });
        return;
      }
      if (!data.cnpj.social_name || data.cnpj.social_name.trim().length < 1) {
        ctx.addIssue({
          path: ["cnpj", "social_name"],
          code: z.ZodIssueCode.custom,
          message: "Razão social é obrigatória",
        });
      }
      if (!data.cnpj.sector || data.cnpj.sector.trim().length < 1) {
        ctx.addIssue({
          path: ["cnpj", "sector"],
          code: z.ZodIssueCode.custom,
          message: "Setor obrigatório",
        });
      }
    }
  });

export type CreateAccountFormSchema = z.infer<typeof schema>;

export function useCreateAccountForm() {
  // Estado para definir se o documento é CPF ou CNPJ:
  const [type, setType] = useState<"cpf" | "cnpj">("cpf");

  // Estado para guardar os dados retornados para holding e controlled
  const [dataHolding, setDataHolding] = useState<ICnpjaResponse[] | null>(null);
  const [dataControlled, setDataControlled] = useState<ICnpjaResponse[] | null>(
    null
  );
  const [selectedControlled, setSelectedControlled] = useState<
    ICnpjaResponse[] | null
  >(null);

  // Estado único para todos os botões (por exemplo, holding, controlled e contact)
  const [buttonsState, setButtonsState] = useState({
    holding: "Validar",
    controlled: "Validar",
    contact: "Validar",
  });

  const router = useRouter();

  // Função para alternar o texto de qualquer botão
  const toggleButtonText = (
    key: keyof typeof buttonsState,
    type: "Validar" | "Editar"
  ) => {
    setButtonsState((prev) => ({
      ...prev,
      [key]: type,
    }));
  };

  const methods = useForm<CreateAccountFormSchema>({
    resolver: zodResolver(schema),
  });

  const handleCpfCnpj = async (
    value: string
  ): Promise<"cpf" | "cnpj" | "invalid"> => {
    const cleanedValue = value.replace(/\D/g, "");

    if (!cleanedValue) {
      methods.setError("document.value", {
        type: "manual",
        message: "Documento não informado",
      });
      return "invalid";
    }

    const exists = await accountExists(cleanedValue);
    if (exists) {
      methods.setError("document.value", {
        type: "manual",
        message: "Documento já cadastrado!",
      });
      return "invalid";
    }

    if (cleanedValue.length === 11) {
      const isValid = isValidCPF(cleanedValue);
      if (!isValid) {
        methods.setError("document.value", {
          type: "manual",
          message: "Documento inválido!",
        });
        return "invalid";
      }
      methods.setValue("document.type", "cpf");
      setType("cpf");
      return "cpf";
    }

    if (cleanedValue.length === 14) {
      const isValid = isValidCNPJ(cleanedValue);
      if (!isValid) {
        methods.setError("document.value", {
          type: "manual",
          message: "Documento inválido!",
        });
        return "invalid";
      }

      const data = await fetchCnpjData(cleanedValue);

      if (data) {
        methods.setValue("cnpj.fantasy_name", data.alias);
        methods.setValue("cnpj.status", data.status.text);
        methods.setValue("cnpj.social_name", data.company.name);
      }

      methods.setValue("document.type", "cnpj");
      setType("cnpj");
      return "cnpj";
    }

    methods.setError("document.value", {
      type: "manual",
      message: "Documento inválido!",
    });
    return "invalid";
  };

  const handleCnpjOrName = async (
    value: string,
    groupType: "controlled" | "holding"
  ) => {
    const cleanedValue = value.replace(/\D/g, "");
    let data;

    if (cleanedValue.length === 14 && isValidCNPJ(cleanedValue)) {
      // É um CNPJ válido
      data = await fetchCnpjData(cleanedValue);
    } else {
      // Se não for CNPJ, trata como nome e usa outra função
      data = await fetchNameData(value);
      if (groupType === "controlled") {
        setDataControlled(data);
        return;
      }
      setDataHolding(data);
    }
    return data;
  };

  const onSubmit = async (data: CreateAccountFormSchema) => {
    const base: Omit<IAccount, "id" | "created_at" | "updated_at"> = {
      document: data.document,

      ...(type === "cpf"
        ? {
            name: data.cpf?.name,
            rg: data.cpf?.rg,
          }
        : {
            social_name: data.cnpj?.social_name,
            fantasy_name: data.cnpj?.fantasy_name,
            state_registration: data.cnpj?.state_registration,
            municipal_registration: data.cnpj?.municipal_registration,
            status: data.cnpj?.status,

            economic_group_holding:
              data.cnpj?.economic_group_holding || undefined,

            economic_group_controlled: data.cnpj?.economic_group_controlled,

            setor: data.cnpj?.sector ? [data.cnpj?.sector] : undefined,
          }),
    };

    const { error, success, id } = await createOneAccount(base);
    if (success) {
      const address = dataHolding?.find(
        (item) => item.taxId === data.cnpj?.economic_group_holding
      )?.address;

      const contacts = dataHolding?.find(
        (item) => item.taxId === data.cnpj?.economic_group_holding
      );

      if (id) {
        // Criando endereço que retornou da busca da API CNPJa
        await createOneAddress({
          accountId: id,
          city: address?.city,
          state: address?.state,
          street: address?.street,
          district: address?.district,
          number: address?.number,
          zip_code: address?.zip,
          complement: "",
          type: ["Comercial"],
        });

        // Criando contatos que retornaram da busca da API CNPJa
        contacts?.phones.map(async (contact) => {
          await createOneContact({
            accountId: id,
            name: contacts.alias,
            contractEnabled: false,
            positionOrRelation: "",
            contactFor: ["Comercial"],
            contactItems: [
              {
                id: crypto.randomUUID(),
                contact: `${contact.area}${contact.number}`,
                type: "Telefone Comercial",
                preferredContact: { phone: true },
              },
            ],
          });
        });
        router.push(`/commercial/account/form/create/tab/address?id=${id}`);
      }
    }

    if (error) {
      Object.entries(error).forEach(([key, message]) => {
        if (key === "cnpj") {
          toast({
            title: "Erro!",
            description: message as string,
            variant: "error",
          });
          methods.reset();
        }
        if (key !== "global" && message) {
          methods.setError(key as any, {
            type: "manual",
            message: message as string,
          });
        }
      });

      if (error.global) {
        toast({
          title: "Erro!",
          description: error.global,
          variant: "error",
        });
      }
    }
  };

  return {
    methods,
    handleCpfCnpj,
    type,
    setType,
    onSubmit,
    handleCnpjOrName,
    dataHolding,
    dataControlled,
    buttonsState,
    toggleButtonText,
    setSelectedControlled,
    selectedControlled,
  };
}
