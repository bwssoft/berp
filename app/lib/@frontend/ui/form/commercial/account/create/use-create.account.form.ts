"use client";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { IAccount } from "@/app/lib/@backend/domain";
import {
  createOneAccount,
  accountExists,
} from "@/app/lib/@backend/action/commercial/account.action";
import { z } from "zod";

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
        economic_group_controlled: z.string().optional(),
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
  const [type, setType] = useState<"cpf" | "cnpj">("cpf");
  const [textButton, setTextButton] = useState("Validar");

  const methods = useForm<CreateAccountFormSchema>({
    resolver: zodResolver(schema),
  });
  console.log(methods.watch());

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

    if (await accountExists(cleanedValue)) {
      methods.setError("document.value", {
        type: "manual",
        message: "Documento já cadastrado!",
      });
      return "invalid";
    }

    if (cleanedValue.length === 11) {
      if (!isValidCPF(cleanedValue)) {
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
      if (!isValidCNPJ(cleanedValue)) {
        methods.setError("document.value", {
          type: "manual",
          message: "Documento inválido!",
        });
        return "invalid";
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

  const onSubmit = async (data: CreateAccountFormSchema) => {
    try {
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

              economic_group_controlled: data.cnpj?.economic_group_controlled
                ? [data.cnpj.economic_group_controlled]
                : undefined,

              setor: data.cnpj?.sector ? [data.cnpj?.sector] : undefined,
            }),
      };

      await createOneAccount(base);
      methods.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    methods,
    handleCpfCnpj,
    type,
    setType,
    onSubmit,
    textButton,
    setTextButton,
  };
}
