"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  IAccount,
  ICnpjaResponse,
  IAddress,
  IContact,
} from "@/app/lib/@backend/domain";
import { accountExists } from "@/app/lib/@backend/action/commercial/account.action";
import { z } from "zod";

import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import {
  fetchCnpjData,
  fetchNameData,
} from "@/app/lib/@backend/action/cnpja/cnpja.action";
import { isValidRG } from "@/app/lib/util/is-valid-rg";
import {
  useCreateAccountFlow,
  LocalAccount,
  LocalAddress,
  LocalContact,
} from "@/app/lib/@frontend/context/create-account-flow.context";

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
        state_registration: z.string().optional(),
        municipal_registration: z.string().optional(),
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

export function useCreateAccountForm() {
  // Get the create account flow context
  const { createAccountLocally, createAddressLocally, createContactLocally } =
    useCreateAccountFlow();

  // Estado para definir se o documento é CPF ou CNPJ:
  const [type, setType] = useState<"cpf" | "cnpj" | undefined>(undefined);

  // Estado para guardar os dados retornados para holding e controlled
  const [dataHolding, setDataHolding] = useState<ICnpjaResponse[]>([]);

  const [dataControlled, setDataControlled] = useState<ICnpjaResponse[]>([]);
  const [dataCnpj, setDataCnpj] = useState<ICnpjaResponse | null>(null);
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
        setDataCnpj(data);

        // Set the values from API
        methods.setValue("cnpj.fantasy_name", data.alias ?? "");
        methods.setValue("cnpj.social_name", data.company.name);
        methods.setValue("cnpj.status", [
          { id: data.status.text, name: data.status.text },
        ]);

        setDisabledFields({
          social_name: true,
          fantasy_name: Boolean(data?.alias?.length),
          status: true,
          state_registration: false,
          municipal_registration: false,
        });
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
        setDataControlled(data as ICnpjaResponse[]);
        return;
      }
      setDataHolding(data as ICnpjaResponse[]);
    }
    return data;
  };

  const debouncedValidationHolding = debounce(async (value: string) => {
    await handleCnpjOrName(value, "holding");
  }, 500);

  const debouncedValidationControlled = debounce(async (value: string) => {
    await handleCnpjOrName(value, "controlled");
  }, 500);

  const onSubmit = async (data: CreateAccountFormSchema) => {
    const address = dataCnpj?.address;
    const contact = dataCnpj?.phones[0];

    // Generate local ID for the account
    const accountLocalId = crypto.randomUUID();

    const base: LocalAccount = {
      idLocal: accountLocalId,
      document: {
        ...data.document,
        value: data.document.value.replace(/\D/g, ""),
      },
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
            economic_group_holding: data.cnpj?.economic_group_holding
              ? {
                  name: data.cnpj?.economic_group_holding?.name! as string,
                  taxId: data.cnpj?.economic_group_holding?.taxId! as string,
                }
              : undefined,
            economic_group_controlled:
              data.cnpj?.economic_group_controlled?.map((item) => ({
                name: item.name! as string,
                taxId: item.taxId! as string,
              })),
            setor: data.cnpj?.sector ? [data.cnpj?.sector] : undefined,
          }),
    };

    createAccountLocally(base);

    if (address) {
      const newAddress: LocalAddress = {
        idLocal: crypto.randomUUID(),
        city: address.city,
        state: address.state,
        street: address.street,
        district: address.district,
        number: address.number,
        zip_code: address.zip,
        complement: address.details ?? "",
        type: ["Comercial"],
      };
      createAddressLocally(newAddress);
    }

    // Create contact locally if available
    if (contact) {
      const newContact: LocalContact = {
        idLocal: crypto.randomUUID(),
        name: dataCnpj?.company.name || dataCnpj?.alias || "",
        contractEnabled: false,
        positionOrRelation: "",
        contactFor: ["Comercial"],
        contactItems: [
          {
            id: crypto.randomUUID(),
            contact: `${contact.area}${contact.number}`,
            type:
              dataCnpj?.phones[0].type === "LANDLINE"
                ? ("Telefone Comercial" as const)
                : ("Celular" as const),
            preferredContact: { phone: true },
          },
        ],
      };
      createContactLocally(newContact);
    }

    // Navigate to next step with account local ID
    router.push(
      `/commercial/account/form/create/tab/address?id=${accountLocalId}`
    );
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
    selectedHolding,
    setSelectedHolding,
    debouncedValidationHolding,
    debouncedValidationControlled,
    disabledFields,
    form: methods,
  };
}
