"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { ICnpjaResponse } from "@/app/lib/@backend/domain";
import { accountExists } from "@/app/lib/@backend/action/commercial/account.action";
import {
  fetcCnpjRegistrationData,
  fetchCnpjData,
  fetchNameData,
} from "@/app/lib/@backend/action/cnpja/cnpja.action";
import {
  findOneAccountEconomicGroup,
  validateControlledEnterprisesNotInHolding,
  validateHoldingEnterpriseNotInGroup,
} from "@/app/lib/@backend/action/commercial/account.economic-group.action";
import { useAuth } from "@/app/lib/@frontend/context";
import {
  useCreateAccountFlow,
  LocalAccount,
  LocalAddress,
  LocalContact,
  LocalAccountEconomicGroup,
} from "@/app/lib/@frontend/context/create-account-flow.context";
import { toast } from "@/app/lib/@frontend/hook/use-toast";

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
        situationIE: z
          .object({
            id: z.string().optional(),
            status: z.boolean().optional(),
            text: z.string().optional(),
          })
          .optional(),
        typeIE: z.string().optional(),
        sector: z
          .string({
            required_error: "Setor obrigatório",
          })
          .min(1, "Setor obrigatório"),
      })
      .optional(),
    economic_group: z
      .object({
        economic_group_holding: z
          .object({
            name: z.string(),
            taxId: z.string(),
          })
          .optional(),
        economic_group_controlled: z
          .array(
            z.object({
              name: z.string(),
              taxId: z.string(),
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

interface CreateAccountFormContextData {
  // Form methods
  methods: ReturnType<typeof useForm<CreateAccountFormSchema>>;

  // Document type and states
  type: "cpf" | "cnpj" | undefined;
  setType: (type: "cpf" | "cnpj" | undefined) => void;
  isSubmitting: boolean;

  // CNPJ data states
  dataHolding: ICnpjaResponse[];
  dataControlled: ICnpjaResponse[];
  dataCnpj: ICnpjaResponse | null;

  // Selected items states
  selectedControlled: ICnpjaResponse[];
  setSelectedControlled: (items: ICnpjaResponse[]) => void;
  selectedHolding: ICnpjaResponse[];
  setSelectedHolding: (items: ICnpjaResponse[]) => void;
  selectedIE: { id: string; text: string; status: boolean } | null;
  setSelectedIE: (
    item: { id: string; text: string; status: boolean } | null
  ) => void;

  // Disabled fields state
  disabledFields: {
    social_name: boolean;
    fantasy_name: boolean;
    status: boolean;
    state_registration: boolean;
    municipal_registration: boolean;
    typeIE: boolean;
  };

  // Button states
  buttonsState: {
    holding: string;
    controlled: string;
    contact: string;
  };
  toggleButtonText: (
    key: "holding" | "controlled" | "contact",
    type: "Validar" | "Editar"
  ) => void;

  // Functions
  handleCpfCnpj: (value: string) => Promise<"cpf" | "cnpj" | "invalid">;
  handleHoldingSelection: (item: ICnpjaResponse | null) => Promise<void>;
  validateHoldingEnterprise: (holdingTaxId: string) => Promise<boolean>;
  validateControlledEnterprises: (
    selectedControlled: ICnpjaResponse[]
  ) => Promise<boolean>;
  debouncedValidationHolding: (value: string) => void;
  debouncedValidationControlled: (value: string) => void;
  onSubmit: (data: CreateAccountFormSchema) => Promise<void>;
}

const CreateAccountFormContext = createContext<
  CreateAccountFormContextData | undefined
>(undefined);

interface CreateAccountFormProviderProps {
  children: ReactNode;
}

export function CreateAccountFormProvider({
  children,
}: CreateAccountFormProviderProps) {
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
    key: "holding" | "controlled" | "contact",
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

  const doc = methods.watch("document.value");

  // Initialize form with existing account data from flow context
  useEffect(() => {
    if (localAccount && doc == localAccount.document.value) {
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
    if (localEconomicGroup && doc == localAccount?.document.value) {
      if (localEconomicGroup.economic_group_holding) {
        const holdingData = {
          taxId: localEconomicGroup.economic_group_holding.taxId || "",
          company: {
            name: localEconomicGroup.economic_group_holding.name || "",
          },
        } as ICnpjaResponse;

        setSelectedHolding([holdingData]);
        methods.setValue("economic_group.economic_group_holding", {
          name: localEconomicGroup.economic_group_holding.name,
          taxId: localEconomicGroup.economic_group_holding.taxId,
        });
      }

      if (
        localEconomicGroup.economic_group_controlled &&
        localEconomicGroup.economic_group_controlled.length > 0
      ) {
        const controlledData = localEconomicGroup.economic_group_controlled.map(
          (controlled) => ({
            taxId: controlled.taxId || "",
            company: {
              name: controlled.name || "",
            },
          })
        ) as ICnpjaResponse[];

        setSelectedControlled(controlledData);
        methods.setValue(
          "economic_group.economic_group_controlled",
          localEconomicGroup.economic_group_controlled
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
      const [data, economicGroupResults] = await Promise.all([
        fetcCnpjRegistrationData(cleanedValue),
        findOneAccountEconomicGroup({
          $or: [
            { "economic_group_holding.taxId": cleanedValue },
            { "economic_group_controlled.taxId": cleanedValue },
          ],
        }),
      ]);

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

        const newDisabledFields = {
          social_name: Boolean(data.company?.name),
          fantasy_name: Boolean(data.alias),
          status: Boolean(data.registrations?.[0]?.status?.text),
          state_registration: Boolean(data.registrations?.[0]?.number),
          municipal_registration: false,
          typeIE: Boolean(data.registrations?.[0]?.type?.text),
        };

        setDisabledFields(newDisabledFields);
      }

      if (
        economicGroupResults?.economic_group_holding &&
        economicGroupResults?.economic_group_controlled
      ) {
        const {
          economic_group_holding: economicGroupHolding,
          economic_group_controlled: economicGroupControlled,
        } = economicGroupResults;

        const holdingData = {
          taxId: economicGroupHolding.taxId,
          company: {
            name: economicGroupHolding.name,
          },
        } as ICnpjaResponse;

        setSelectedHolding([holdingData]);
        methods.setValue("economic_group.economic_group_holding", {
          name: holdingData.company.name,
          taxId: holdingData.taxId,
        });

        const controlledData = economicGroupControlled.map((controlled) => ({
          taxId: controlled.taxId,
          company: {
            name: controlled.name,
          },
        })) as ICnpjaResponse[];

        // Add the current company being created to controlled companies if not already present
        if (data?.company?.name) {
          const currentCompanyTaxId = cleanedValue.replace(/\D/g, "");
          const holdingTaxId = holdingData.taxId.replace(/\D/g, "");

          // Check if current company is already in the controlled list
          const isCurrentCompanyAlreadyIncluded = economicGroupControlled.some(
            (controlled) =>
              controlled.taxId.replace(/\D/g, "") === currentCompanyTaxId
          );

          const isCurrentCompanyHolding = currentCompanyTaxId === holdingTaxId;
          console.log("🚀 ~ handleCpfCnpj ~ holdingTaxId:", holdingTaxId);
          console.log(
            "🚀 ~ handleCpfCnpj ~ currentCompanyTaxId:",
            currentCompanyTaxId
          );
          console.log(
            "🚀 ~ handleCpfCnpj ~ isCurrentCompanyHolding:",
            isCurrentCompanyHolding
          );

          if (!isCurrentCompanyAlreadyIncluded && !isCurrentCompanyHolding) {
            const currentCompanyData = {
              taxId: cleanedValue,
              company: {
                name: data.company.name,
              },
            } as ICnpjaResponse;

            controlledData.push(currentCompanyData);

            const currentCompanyFormData = {
              name: data.company.name,
              taxId: cleanedValue,
            };

            const updatedControlledFormData = [
              ...economicGroupControlled,
              currentCompanyFormData,
            ];

            setSelectedControlled(controlledData);
            methods.setValue(
              "economic_group.economic_group_controlled",
              updatedControlledFormData
            );
          } else {
            // Current company is already in the list, just set the existing data
            setSelectedControlled(controlledData);
            methods.setValue(
              "economic_group.economic_group_controlled",
              economicGroupControlled
            );
          }
        } else {
          setSelectedControlled(controlledData);
          methods.setValue(
            "economic_group.economic_group_controlled",
            economicGroupControlled
          );
        }
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

  const validateHoldingEnterprise = async (
    holdingTaxId: string
  ): Promise<boolean> => {
    try {
      const cleanedTaxId = holdingTaxId.replace(/\D/g, "");

      const validationResult =
        await validateHoldingEnterpriseNotInGroup(cleanedTaxId);

      if (!validationResult.isValid && validationResult.conflictingEntry) {
        const entry = validationResult.conflictingEntry;

        let errorMessage =
          "Não é possível selecionar esta empresa como holding:\n\n";

        if (entry.conflictType === "controlled") {
          errorMessage += `⚠️ Esta empresa já está controlada por outro grupo:\n`;
          if (entry.holdingName) {
            errorMessage += `• ${entry.name} (${entry.taxId}) - já pertence ao grupo da holding ${entry.holdingName} (${entry.holdingTaxId})\n`;
          } else {
            errorMessage += `• ${entry.name} (${entry.taxId}) - já pertence a outro grupo econômico\n`;
          }
        }

        toast({
          title: "Conflito de Grupo Econômico",
          description: errorMessage.trim(),
          variant: "error",
        });

        return false;
      }

      return validationResult.isValid;
    } catch (error) {
      console.error("Error validating holding enterprise:", error);
      toast({
        title: "Erro",
        description: "Erro ao validar empresa holding",
        variant: "error",
      });
      return false;
    }
  };

  const handleHoldingSelection = async (item: ICnpjaResponse | null) => {
    if (!item) {
      setSelectedHolding([]);
      setSelectedControlled([]);
      methods.setValue("economic_group.economic_group_holding", undefined);
      methods.setValue("economic_group.economic_group_controlled", undefined);
      return;
    }

    // Validate the holding selection before proceeding
    const isValid = await validateHoldingEnterprise(item.taxId);
    if (!isValid) {
      return; // Stop if validation fails
    }

    // Set the selected holding first
    setSelectedHolding([item]);
    methods.setValue("economic_group.economic_group_holding", {
      name: item.company.name,
      taxId: item.taxId,
    });

    try {
      const selectedHoldingTaxId = item.taxId.replace(/\D/g, "");

      // Search for existing economic group with this holding
      const existingEconomicGroup = await findOneAccountEconomicGroup({
        "economic_group_holding.taxId": item.taxId,
      });

      if (existingEconomicGroup) {
        let controlledData: ICnpjaResponse[] = [];
        let controlledFormData: { name: string; taxId: string }[] = [];

        const currentCompany = methods.getValues("cnpj");
        const currentDocument = methods.getValues("document");
        const currentCompanyTaxId = currentDocument?.value
          ? currentDocument.value.replace(/\D/g, "")
          : "";

        const existingHoldingTaxId =
          existingEconomicGroup.economic_group_holding?.taxId?.replace(
            /\D/g,
            ""
          ) || selectedHoldingTaxId;

        const normalizedExistingControlled = (
          existingEconomicGroup.economic_group_controlled || []
        )
          .filter((controlled) => !!controlled?.taxId)
          .filter(
            (controlled) =>
              controlled.taxId.replace(/\D/g, "") !== existingHoldingTaxId
          );

        if (normalizedExistingControlled.length > 0) {
          const existingControlled = normalizedExistingControlled.map(
            (controlled) => ({
              taxId: controlled.taxId,
              company: {
                name: controlled.name,
              },
            })
          ) as ICnpjaResponse[];

          controlledData = [...existingControlled];
          controlledFormData = [...normalizedExistingControlled];
        }

        const shouldAddCurrentCompany =
          currentCompany?.social_name &&
          currentCompanyTaxId &&
          currentCompanyTaxId !== existingHoldingTaxId &&
          currentCompanyTaxId !== selectedHoldingTaxId;

        if (shouldAddCurrentCompany) {
          const isCurrentCompanyAlreadyIncluded =
            normalizedExistingControlled.some(
              (controlled) =>
                controlled.taxId.replace(/\D/g, "") === currentCompanyTaxId
            );

          if (!isCurrentCompanyAlreadyIncluded) {
            const currentCompanyData = {
              taxId: currentDocument!.value,
              company: {
                name: currentCompany.social_name,
              },
            } as ICnpjaResponse;

            const currentCompanyFormData = {
              name: currentCompany.social_name,
              taxId: currentDocument!.value,
            };

            controlledData.push(currentCompanyData);
            controlledFormData.push(currentCompanyFormData);
          }
        }

        setSelectedControlled(controlledData);
        methods.setValue(
          "economic_group.economic_group_controlled",
          controlledFormData
        );

        toast({
          title: "Grupo Econômico Encontrado",
          description:
            "Dados do grupo econômico foram carregados automaticamente.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error searching for economic group:", error);
    }
  };

  const validateControlledEnterprises = async (
    selectedControlled: ICnpjaResponse[]
  ): Promise<boolean> => {
    if (!selectedControlled || selectedControlled.length === 0) {
      return true;
    }

    try {
      const initialControlled =
        localEconomicGroup?.economic_group_controlled || [];
      const initialControlledTaxIds = initialControlled.map((item) =>
        item.taxId.replace(/\D/g, "")
      );

      const newlyAddedControlled = selectedControlled.filter((item) => {
        const cleanTaxId = item.taxId.replace(/\D/g, "");
        return !initialControlledTaxIds.includes(cleanTaxId);
      });

      if (newlyAddedControlled.length === 0) {
        return true;
      }

      const controlledTaxIds = newlyAddedControlled.map((item) =>
        item.taxId.replace(/\D/g, "")
      );

      // Check if any controlled enterprise is the same as the selected holding
      const selectedHolding = methods.getValues(
        "economic_group.economic_group_holding"
      );
      if (selectedHolding) {
        const holdingTaxId = selectedHolding.taxId?.replace(/\D/g, "");
        if (holdingTaxId && controlledTaxIds.includes(holdingTaxId)) {
          toast({
            title: "Configuração Inválida",
            description: `A holding "${selectedHolding.name}" não pode ser adicionada como empresa controlada.`,
            variant: "error",
          });
          return false;
        }
      }

      const validationResult =
        await validateControlledEnterprisesNotInHolding(controlledTaxIds);

      if (!validationResult.isValid && validationResult.conflictingEntries) {
        // Group conflicts by type for better error messages
        const holdingConflicts = validationResult.conflictingEntries.filter(
          (entry) => entry.conflictType === "holding"
        );
        const controlledConflicts = validationResult.conflictingEntries.filter(
          (entry) => entry.conflictType === "controlled"
        );

        let errorMessage =
          "Não é possível adicionar as seguintes empresas como controladas:\n\n";

        if (holdingConflicts.length > 0) {
          errorMessage += "⚠️ Empresas que já são Holdings:\n";
          holdingConflicts.forEach((entry) => {
            errorMessage += `• ${entry.name} (${entry.taxId}) - já é uma holding de grupo econômico\n`;
          });
          errorMessage += "\n";
        }

        if (controlledConflicts.length > 0) {
          errorMessage += "⚠️ Empresas já controladas por outros grupos:\n";
          controlledConflicts.forEach((entry) => {
            if (entry.holdingName) {
              errorMessage += `• ${entry.name} (${entry.taxId}) - já pertence ao grupo da holding ${entry.holdingName} (${entry.holdingTaxId})\n`;
            } else {
              errorMessage += `• ${entry.name} (${entry.taxId}) - já pertence a outro grupo econômico\n`;
            }
          });
        }

        toast({
          title: "Conflito de Grupo Econômico",
          description: errorMessage.trim(),
          variant: "error",
        });

        return false;
      }

      return validationResult.isValid;
    } catch (error) {
      console.error("Error validating controlled enterprises:", error);
      toast({
        title: "Erro",
        description: "Erro ao validar empresas controladas",
        variant: "error",
      });
      return false;
    }
  };

  const onSubmit = async (data: CreateAccountFormSchema) => {
    setIsSubmitting(true);

    try {
      const address = dataCnpj?.address;
      const phones = dataCnpj?.phones || [];
      const emails = dataCnpj?.emails || [];

      const accountLocalId = crypto.randomUUID();

      // @ts-ignore
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
              situationIE: data.cnpj?.situationIE || {},
              typeIE: data.cnpj?.typeIE,
              setor: data.cnpj?.sector ? [data.cnpj?.sector] : undefined,
            }),
      };

      createAccountLocally(base);

      // Create economic group if data exists
      if (
        data.economic_group &&
        (data.economic_group.economic_group_holding ||
          data.economic_group.economic_group_controlled)
      ) {
        const economicGroupData: LocalAccountEconomicGroup = {
          economic_group_holding: data.economic_group.economic_group_holding,
          economic_group_controlled:
            data.economic_group.economic_group_controlled,
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
          type: ["Fiscal"],
          default_address: true,
        };

        createAddressLocally(newAddress);
      }

      // Create contacts for each phone
      if (phones && phones.length > 0 && dataCnpj) {
        phones.forEach((phone, index) => {
          const newContact: LocalContact = {
            id: crypto.randomUUID(),
            name: dataCnpj.company.name || dataCnpj.alias || "",
            contractEnabled: false,
            positionOrRelation: "",
            taxId: dataCnpj.taxId,
            contactFor: ["Fiscal"],
            contactItems: [
              {
                id: crypto.randomUUID(),
                contact: `${phone.area}${phone.number}`,
                type:
                  phone.type === "LANDLINE" ? "Telefone Comercial" : "Celular",
                preferredContact: {},
              },
            ],
            originType: "api",
          };
          createContactLocally(newContact);
        });
      }

      // Create contacts for each email
      if (emails && emails.length > 0 && dataCnpj) {
        emails.forEach((email, index) => {
          const newContact: LocalContact = {
            id: crypto.randomUUID(),
            name: dataCnpj.company.name || dataCnpj.alias || "",
            contractEnabled: false,
            positionOrRelation: "",
            taxId: dataCnpj.taxId,
            contactFor: ["Fiscal"],
            contactItems: [
              {
                id: crypto.randomUUID(),
                contact: email.address,
                type: "Email",
                preferredContact: {},
              },
            ],
            originType: "api",
          };
          createContactLocally(newContact);
        });
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

  const contextValue: CreateAccountFormContextData = {
    methods,
    type,
    setType,
    isSubmitting,
    dataHolding,
    dataControlled,
    dataCnpj,
    selectedControlled,
    setSelectedControlled,
    selectedHolding,
    setSelectedHolding,
    selectedIE,
    setSelectedIE,
    disabledFields,
    buttonsState,
    toggleButtonText,
    handleCpfCnpj,
    handleHoldingSelection,
    validateHoldingEnterprise,
    validateControlledEnterprises,
    debouncedValidationHolding,
    debouncedValidationControlled,
    onSubmit,
  };

  return (
    <CreateAccountFormContext.Provider value={contextValue}>
      {children}
    </CreateAccountFormContext.Provider>
  );
}

export function useCreateAccountFormContext() {
  const context = useContext(CreateAccountFormContext);
  if (context === undefined) {
    throw new Error(
      "useCreateAccountFormContext must be used within a CreateAccountFormProvider"
    );
  }
  return context;
}
