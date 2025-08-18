"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IAccount, ICnpjaResponse } from "@/app/lib/@backend/domain";
import { updateOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { z } from "zod";

import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useRouter } from "next/navigation";
import { isValidRG } from "@/app/lib/util/is-valid-rg";
import { createOneHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { useAuth } from "@/app/lib/@frontend/context";
import { useQueryClient } from "@tanstack/react-query";

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
          .min(7)
          .refine(
            (val) => {
              if (!val) return true;

              const cleaned = val.replace(/[^\w]/g, "");

              if (cleaned.length === 11) {
                return isValidCPF(cleaned);
              }

              return isValidRG(cleaned);
            },
            {
              message: "Documento inválido: informe um CPF ou RG válido",
            }
          )
          .optional(),
      })
      .optional(),
    cnpj: z
      .object({
        social_name: z.string().min(1, "Razão social é obrigatória"),
        fantasy_name: z.string().optional(),
        state_registration: z
          .string()
          .max(14, "Inscrição Estadual deve ter no máximo 14 dígitos")
          .optional(),
        municipal_registration: z
          .string()
          .max(15, "Inscrição Municipal deve ter no máximo 15 dígitos")
          .optional(),
        status: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
            })
          )
          .optional(),
        sector: z
          .string({
            required_error: "Setor obrigatório",
          })
          .min(1, "Setor obrigatório"),
        economic_group_holding: z
          .object({
            taxId: z.string().optional(),
            name: z.string().optional(),
          })
          .optional(),
        economic_group_controlled: z
          .array(
            z.object({
              taxId: z.string().optional(),
              name: z.string().optional(),
            })
          )
          .optional(),
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

interface Props {
  accountData?: IAccount;
  closeModal: () => void;
}

export function useUpdateAccountForm({ accountData, closeModal }: Props) {
  // Estado para definir se o documento é CPF ou CNPJ:
  const [type, setType] = useState<"cpf" | "cnpj" | undefined>(undefined);

  // Estado para guardar os dados retornados para holding e controlled
  const [selectedControlled, setSelectedControlled] = useState<
    ICnpjaResponse[]
  >([]);

  const [selectedHolding, setSelectedHolding] = useState<ICnpjaResponse[]>([]);

  const [disabledFields, setDisabledFields] = useState<{
    social_name: boolean;
    fantasy_name: boolean;
    status: boolean;
    state_registration: boolean;
    municipal_registration: boolean;
  }>({
    social_name: false,
    fantasy_name: false,
    status: false,
    state_registration: false,
    municipal_registration: false,
  });

  const [buttonsState, setButtonsState] = useState({
    holding: "Validar",
    controlled: "Validar",
    contact: "Validar",
  });

  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const sectorData =
    accountData?.setor && accountData.setor.length > 0
      ? accountData.setor[0]
      : "";

  const methods = useForm<CreateAccountFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...accountData,
      ...(accountData?.document.type === "cnpj"
        ? {
            cnpj: {
              sector: sectorData,
              social_name: accountData?.social_name,
              fantasy_name: accountData?.fantasy_name,
              municipal_registration: accountData?.municipal_registration,
              state_registration: accountData?.state_registration,
              status: [
                {
                  id: accountData?.id,
                  name: accountData?.status,
                },
              ],
            },
          }
        : {
            cpf: {
              name: accountData?.name,
              rg: accountData?.rg,
            },
          }),
      document: {
        type: accountData?.document.type,
        value: accountData?.document.value,
      },
      address: accountData?.address,
      contact: accountData?.contacts,
    },
  });

  const onSubmit = async (data: CreateAccountFormSchema) => {
    const base = {
      document: {
        ...data.document,
        value: data.document.value.replace(/\D/g, ""),
      },
      id: accountData?.id,
      ...(type === "cpf"
        ? {
            name: data.cpf?.name,
            rg: data.cpf?.rg ? data.cpf?.rg.replace(/\D/g, "") : "",
          }
        : {
            social_name: data.cnpj?.social_name,
            fantasy_name: data.cnpj?.fantasy_name,
            state_registration: data.cnpj?.state_registration,
            municipal_registration: data.cnpj?.municipal_registration,
            status: data.cnpj?.status?.[0]?.name,
            economic_group_holding: {
              name: data.cnpj?.economic_group_holding?.name! as string,
              taxId: data.cnpj?.economic_group_holding?.taxId! as string,
            },
            economic_group_controlled:
              data.cnpj?.economic_group_controlled?.map((item) => ({
                name: item.name! as string,
                taxId: item.taxId! as string,
              })),
            setor: data.cnpj?.sector ? [data.cnpj?.sector] : undefined,
          }),
    };

    const { success, error, editedFields } = await updateOneAccount(
      { id: accountData?.id },
      base
    );

    if (success && editedFields) {
      // Criar histórico
      await createOneHistorical({
        accountId: String(accountData?.id),
        title: `Atualização de conta`,
        editedFields: editedFields,
        type: "manual",
        author: {
          name: user?.name ?? "",
          avatarUrl: "",
        },
      });
      toast({
        title: "Sucesso!",
        description: "Dados da conta atualizado com sucesso!",
        variant: "success",
      });

      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({
        queryKey: ["findOneAccount", accountData?.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["findManyAccount"],
      });

      closeModal();
    }

    // Erros
    if (error) {
      if (error.global) {
        toast({
          title: "Erro!",
          description: error.global,
          variant: "error",
        });
      }

      Object.entries(error).forEach(([key, message]) => {
        if (key === "cnpj") {
          toast({
            title: "Erro!",
            description: message as string,
            variant: "error",
          });
          methods.reset();
        } else {
          methods.setError(key as any, {
            type: "manual",
            message: message as string,
          });
        }
      });
    }
  };

  return {
    methods,
    type,
    setType,
    onSubmit,
    buttonsState,
    toggleButtonText,
    setSelectedControlled,
    selectedControlled,
    selectedHolding,
    setSelectedHolding,
    disabledFields,
    form: methods,
    register: methods.register,
    errors: methods.formState,
    control: methods.control,
  };
}
