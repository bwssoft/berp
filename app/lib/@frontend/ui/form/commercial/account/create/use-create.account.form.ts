"use client";

import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ICnpjaResponse } from "@/app/lib/@backend/domain";
import { accountExists } from "@/app/lib/@backend/action/commercial/account.action";
import { z } from "zod";

import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import {
  fetcCnpjRegistrationData,
  fetchCnpjData,
  fetchNameData,
} from "@/app/lib/@backend/action/cnpja/cnpja.action";
import { useAuth } from '@/frontend/context/auth.context';

import {
  useCreateAccountFlow,
  LocalAccount,
  LocalAddress,
  LocalContact,
  LocalAccountEconomicGroup,
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
          .regex(
            /^[A-Za-z]{0,2}[-\s.]?\d{1,2}\.?\d{3}\.?\d{3}[-\s.]?[A-Za-z0-9]{0,2}$/,
            "RG deve conter apenas números, pontos, barras e hífen"
          )
          .min(5, "RG muito curto")
          .max(20, "RG muito longo")
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
        status: z.string().optional(),
        situationIE: z.object({
          id: z.string(),
          status: z.boolean(),
          text: z.string(),
        }),
        typeIE: z.string().optional(),
        sector: z
          .string({
            required_error: "Setor obrigatório",
          })
          .min(1, "Setor obrigatório"),
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
  // Get the create account flow context including existing account data
  const {
    createAccountLocally,
    createAddressLocally,
    createContactLocally,
    createEconomicGroupLocally,
    account: localAccount,
    economicGroup: localEconomicGroup,
  } = useCreateAccountFlow();

  // Estado para definir se o documento é CPF ou CNPJ:
  const [type, setType] = useState<"cpf" | "cnpj" | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para guardar os dados retornados para holding e controlled
  const [dataHolding, setDataHolding] = useState<ICnpjaResponse[]>([]);
  const [dataControlled, setDataControlled] = useState<ICnpjaResponse[]>([]);
  const [dataCnpj, setDataCnpj] = useState<ICnpjaResponse | null>(null);
  const [selectedControlled, setSelectedControlled] = useState<
    ICnpjaResponse[]
  >([]);

  const [selectedHolding, setSelectedHolding] = useState<ICnpjaResponse[]>([]);

  const [selectedIE, setSelectedIE] = useState<{
    id: string;
    text: string;
    status: boolean;
  } | null>(null);

  const [disabledFields, setDisabledFields] = useState<{
    social_name: boolean;
    fantasy_name: boolean;
    status: boolean;
    state_registration: boolean;
    municipal_registration: boolean;
    typeIE: boolean;
  }>({
    social_name: false,
    fantasy_name: false,
    status: false,
    state_registration: false,
    municipal_registration: false,
    typeIE: false,
  });

  const [buttonsState, setButtonsState] = useState({
    holding: "Validar",
    controlled: "Validar",
    contact: "Validar",
  });

  const router = useRouter();
  const { user } = useAuth();

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

  // Initialize form with existing account data from flow context
  useEffect(() => {
    if (localAccount) {
      // Set the document type first
      setType(localAccount.document.type);

      // Populate form fields with existing data
      methods.setValue("document.value", localAccount.document.value);
      methods.setValue("document.type", localAccount.document.type);

      if (localAccount.document.type === "cpf") {
        if (localAccount.name) {
          methods.setValue("cpf.name", localAccount.name);
        }
        if (localAccount.rg) {
          methods.setValue("cpf.rg", localAccount.rg);
        }
      }

      if (localAccount.document.type === "cnpj") {
        if (localAccount.social_name) {
          methods.setValue("cnpj.social_name", localAccount.social_name);
        }
        if (localAccount.fantasy_name) {
          methods.setValue("cnpj.fantasy_name", localAccount.fantasy_name);
        }
        if (localAccount.state_registration) {
          methods.setValue(
            "cnpj.state_registration",
            localAccount.state_registration
          );
        }
        if (localAccount.municipal_registration) {
          methods.setValue(
            "cnpj.municipal_registration",
            localAccount.municipal_registration
          );
        }
        if (localAccount.status) {
          methods.setValue("cnpj.status", localAccount.status);
        }
        if (localAccount.setor && localAccount.setor.length > 0) {
          methods.setValue("cnpj.sector", localAccount.setor[0]); // Assuming first sector
        }

        if (localAccount.situationIE) {
          methods.setValue("cnpj.situationIE", localAccount.situationIE);
          setSelectedIE(localAccount.situationIE);
        }

        if (localAccount.typeIE) {
          methods.setValue("cnpj.typeIE", localAccount.typeIE);
        }
      }
    }

    // Initialize economic group data from separate context
    if (localEconomicGroup) {
      if (localEconomicGroup.economic_group_holding) {
        setSelectedHolding([
          {
            taxId: localEconomicGroup.economic_group_holding.taxId || "",
            company: {
              name: localEconomicGroup.economic_group_holding.name || "",
            },
          } as ICnpjaResponse,
        ]);
      }

      if (
        localEconomicGroup.economic_group_controlled &&
        localEconomicGroup.economic_group_controlled.length > 0
      ) {
        setSelectedControlled(
          localEconomicGroup.economic_group_controlled.map((controlled) => ({
            taxId: controlled.taxId || "",
            company: {
              name: controlled.name || "",
            },
          })) as ICnpjaResponse[]
        );
      }
    }
  }, [localAccount, localEconomicGroup, methods]);

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

    // Determine the new document type
    let newType: "cpf" | "cnpj" | "invalid" = "invalid";

    if (cleanedValue.length === 11) {
      const isValid = isValidCPF(cleanedValue);
      if (!isValid) {
        methods.setError("document.value", {
          type: "manual",
          message: "Documento inválido!",
        });
        return "invalid";
      }
      newType = "cpf";
    } else if (cleanedValue.length === 14) {
      const isValid = isValidCNPJ(cleanedValue);
      if (!isValid) {
        methods.setError("document.value", {
          type: "manual",
          message: "Documento inválido!",
        });
        return "invalid";
      }
      newType = "cnpj";
    } else {
      methods.setError("document.value", {
        type: "manual",
        message: "Documento inválido!",
      });
      return "invalid";
    }

    if (type && type !== newType) {
      const currentDocument = methods.getValues("document");
      methods.reset({
        document: currentDocument,
      });

      // Reset all local states
      setSelectedControlled([]);
      setSelectedHolding([]);
      setSelectedIE(null);
      setDataHolding([]);
      setDataControlled([]);
      setDataCnpj(null);
      setDisabledFields({
        social_name: false,
        fantasy_name: false,
        status: false,
        state_registration: false,
        municipal_registration: false,
        typeIE: false,
      });
    }

    if (newType === "cpf") {
      methods.clearErrors("document.value");
      methods.setValue("document.type", "cpf");
      setType("cpf");
      return "cpf";
    }

    if (newType === "cnpj") {
      const data = await fetcCnpjRegistrationData(cleanedValue);
      if (data) {
        setDataCnpj(data);

        // Set the values from API
        methods.setValue("cnpj.fantasy_name", data.alias ?? "");
        methods.setValue("cnpj.social_name", data.company.name);
        methods.setValue(
          "cnpj.state_registration",
          data.registrations[0]?.number ?? ""
        );
        methods.setValue("cnpj.status", data.registrations[0]?.status.text);
        const situationIE = {
          id: data.registrations[0]?.enabled ? "1" : "2",
          text: data.registrations[0]?.enabled
            ? "Habilitada"
            : "Não habilitada",
          status: data.registrations[0]?.enabled,
        };
        methods.setValue("cnpj.situationIE", situationIE);
        setSelectedIE(situationIE);
        methods.setValue("cnpj.typeIE", data.registrations[0]?.type.text);

        setDisabledFields({
          social_name: true,
          fantasy_name: Boolean(data?.alias?.length),
          status: true,
          state_registration: false,
          municipal_registration: false,
          typeIE: true,
        });
      }

      methods.setValue("document.type", "cnpj");
      setType("cnpj");
      methods.clearErrors("document.value");

      return "cnpj";
    }

    return "invalid";
  };

  const handleCnpjOrName = async (
    value: string,
    groupType: "controlled" | "holding"
  ) => {
    const cleanedValue = value.replace(/\D/g, "");

    let data;

    if (isValidCNPJ(cleanedValue)) {
      const cnpjData = await fetchCnpjData(cleanedValue);
      data = [cnpjData];
    } else {
      data = await fetchNameData(value);
    }

    if (groupType === "controlled") {
      setDataControlled(data as ICnpjaResponse[]);
    } else {
      setDataHolding(data as ICnpjaResponse[]);
    }
  };

  const debouncedValidationHolding = debounce(async (value: string) => {
    await handleCnpjOrName(value, "holding");
  }, 500);

  const debouncedValidationControlled = debounce(async (value: string) => {
    await handleCnpjOrName(value, "controlled");
  }, 500);

  const onSubmit = async (data: CreateAccountFormSchema) => {
    setIsSubmitting(true);

    try {
      const address = dataCnpj?.address;
      const contact = dataCnpj?.phones[0];

      const accountLocalId = crypto.randomUUID();

      const base: LocalAccount = {
        id: accountLocalId,
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
              status: data.cnpj?.status,
              situationIE: data.cnpj?.situationIE,
              typeIE: data.cnpj?.typeIE,
              setor: data.cnpj?.sector ? [data.cnpj?.sector] : undefined,
            }),
      };

      createAccountLocally(base);

      // Create economic group if data exists
      if (type === "cnpj" && (selectedHolding.length > 0 || selectedControlled.length > 0)) {
        const economicGroupData: LocalAccountEconomicGroup = {
          economic_group_holding: selectedHolding.length > 0 ? {
            name: selectedHolding[0].company?.name || "",
            taxId: selectedHolding[0].taxId || "",
          } : undefined,
          economic_group_controlled: selectedControlled.length > 0 
            ? selectedControlled.map(controlled => ({
                name: controlled.company?.name || "",
                taxId: controlled.taxId || "",
              }))
            : undefined,
        };

        createEconomicGroupLocally(economicGroupData);
      }

      // Criar endereço
      if (address) {
        const newAddress: LocalAddress = {
          id: crypto.randomUUID(),
          city: address.city,
          state: address.state,
          street: address.street,
          district: address.district,
          number: address.number,
          zip_code: address.zip,
          complement: address.details ?? "",
          type: ["Faturamento"],
          default_address: true,
        };

        createAddressLocally(newAddress);
      }

      if (contact) {
        const newContact: LocalContact = {
          id: crypto.randomUUID(),
          name: dataCnpj?.company.name || dataCnpj?.alias || "",
          contractEnabled: false,
          positionOrRelation: "",
          originType: "api",
          taxId: dataCnpj.taxId, // pra buscar o contato atualizado pelo taxId no card de contato
          contactFor: ["Fiscal"],
          contactItems: [
            {
              id: crypto.randomUUID(),
              contact: `${contact.area}${contact.number}`,
              type:
                dataCnpj?.phones[0].type === "LANDLINE"
                  ? "Telefone Comercial"
                  : "Celular",
              preferredContact: {},
            },
          ],
        };
        createContactLocally(newContact);
      }

      router.push(
        `/commercial/account/form/create/tab/address?accountId=${accountLocalId}`
      );

      return;
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar conta localmente",
        variant: "error",
      });

      setIsSubmitting(false);
    }
  };

  return {
    methods,
    handleCpfCnpj,
    type,
    setType,
    onSubmit,
    isSubmitting,
    handleCnpjOrName,
    dataHolding,
    dataControlled,
    buttonsState,
    toggleButtonText,
    setSelectedControlled,
    selectedControlled,
    selectedHolding,
    setSelectedHolding,
    selectedIE,
    setSelectedIE,
    debouncedValidationHolding,
    debouncedValidationControlled,
    disabledFields,
    form: methods,
  };
}
