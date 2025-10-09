"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import {
  createOnePriceTable,
  updateOnePriceTable,
  validateBillingConditionsPriceTable,
  findOnePriceTable,
} from "@/backend/action/commercial/price-table.action";
import {
  IEquipmentPayment,
  IPriceRange,
  ISimcardPayment,
  IServicePayment,
  StatusPriceTable,
  IPriceTable,
} from "@/backend/domain/commercial/entity/price-table.definition";
import { IPriceTableCondition } from "@/backend/domain/commercial/entity/price-table-condition.definition";

/** UFs do Brasil */
export const BRAZILIAN_UF_ENUM = z.enum([
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const);
export type BrazilianUF = z.infer<typeof BRAZILIAN_UF_ENUM>;

const PTBR_MONEY_REGEX = /^(\d{1,3}(\.\d{3})*|\d+)(,\d{2})?$/;
/** Condição por grupo */
const priceTableConditionSchema = z.object({
  id: z.string().min(1),
  /** UFs atendidas por esta condição */
  salesFor: z.array(BRAZILIAN_UF_ENUM).optional(),
  /** Limite de faturamento (string pt-BR) */
  billingLimit: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || PTBR_MONEY_REGEX.test(v),
      "Informe um valor válido (ex.: 1.234,56)"
    ),
  /** Quem será faturado (id/opção) */
  toBillFor: z.string().min(1, "Selecione para quem faturar"),
});

/** Grupo de condições */
const priceTableConditionGroupSchema = z.object({
  id: z.string().min(1),
  /** Ativa prioridade no grupo */
  priority: z.boolean().optional(),
  /** Lista de condições */
  conditions: z
    .array(priceTableConditionSchema)
    .min(1, "Adicione pelo menos uma condição"),
});

// Schema de validação com Zod baseado no IPriceTable
const priceTableSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome da tabela é obrigatório")
      .max(100, "Nome muito longo (máximo 100 caracteres)"),
    startDateTime: z.date({
      required_error: "Data e hora de início são obrigatórias",
      invalid_type_error: "Data inválida",
    }),
    endDateTime: z
      .date({
        invalid_type_error: "Data inválida",
      })
      .optional(),
    isTemporary: z.boolean().default(false),

    groups: z.array(priceTableConditionGroupSchema).default([]),

    // Configurações de faturamento - billTo é opcional, validação será feita nas condições individuais
    billingConfig: z.object({
      salesFor: z.string().optional(),
      billingLimit: z.string().optional(),
      billTo: z.string().optional(),
    }),
    equipmentWithSim: z.record(z.any()).default({}),
    equipmentWithoutSim: z.record(z.any()).default({}),
    simCards: z.array(z.any()).default([]),
    accessories: z.record(z.any()).default({}),
    services: z.array(z.any()).default([]),
  })
  .refine(
    (data) => {
      if (data.isTemporary) {
        if (!data.endDateTime) {
          return false;
        }
        return data.endDateTime > data.startDateTime;
      }
      return true;
    },
    {
      message:
        "Data de fim é obrigatória e deve ser posterior à data de início para tabelas temporárias",
      path: ["endDateTime"],
    }
  )
  .refine(
    (data) => {
      // Ensure there's at least one group with at least one condition that has toBillFor
      const hasValidBillingCondition = data.groups.some((group) =>
        group.conditions.some(
          (condition) =>
            condition.toBillFor && condition.toBillFor.trim().length > 0
        )
      );
      return hasValidBillingCondition;
    },
    {
      message:
        "Pelo menos uma condição deve ter o campo 'Faturar para' preenchido",
      path: ["groups"],
    }
  );

export type CreatePriceTableFormData = z.infer<typeof priceTableSchema>;

interface UsePriceTableFormProps {
  priceTableId?: string;
  editMode?: boolean;
  cloneMode?: boolean;
}

type Group = {
  id: string;
  conditions: IPriceTableCondition[];
  priority?: boolean;
};

type Status = "red" | "yellow" | "green" | "blue";

const STATUS_STYLES: Record<Status, string> = {
  red: "bg-red-100 border-l-red-500 text-red-800",
  yellow: "bg-yellow-100 border-l-yellow-500 text-yellow-800",
  green: "bg-green-100 border-l-green-500 text-green-800",
  blue: "bg-blue-100 border-l-blue-500 text-blue-800",
};

const uid = () => crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

const createEmptyCondition = (): IPriceTableCondition => ({
  id: uid(),
  salesFor: [],
  billingLimit: "",
  toBillFor: "",
});

const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getDefaultStartDateTime = () => {
  const now = new Date();
  return now;
};

const ensureFutureStartDate = (startDateTime: Date) => {
  const now = new Date();
  const oneMinuteFromNow = new Date(now.getTime() + 60000);

  if (startDateTime <= now) {
    return oneMinuteFromNow;
  }

  return startDateTime;
};

const createPriceRange = (tiers: any[]): IPriceRange[] => {
  if (!tiers || !Array.isArray(tiers)) {
    console.warn("❌ Invalid tiers provided to createPriceRange:", tiers);
    return [];
  }

  const filtered = tiers.filter((tier) => {
    const hasFrom =
      tier?.from !== undefined && tier?.from !== null && tier?.from !== "";
    const hasPricePerUnit =
      tier?.pricePerUnit !== undefined &&
      tier?.pricePerUnit !== null &&
      tier?.pricePerUnit !== "";

    return hasFrom && hasPricePerUnit;
  });

  const mapped = filtered.map((tier) => {
    const priceRange = {
      from: Number(tier.from),
      to: tier.isLast ? Number.MAX_SAFE_INTEGER : Number(tier.to || 0),
      unitPrice: Number(tier.pricePerUnit),
    };

    return priceRange;
  });

  return mapped;
};

export function usePriceTableForm({
  priceTableId,
  editMode = false,
  cloneMode = false,
}: UsePriceTableFormProps = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPriceTable, setLoadingPriceTable] = useState(!!priceTableId);

  const [existingEquipmentPayment, setExistingEquipmentPayment] = useState<
    IEquipmentPayment[]
  >([]);
  const [existingEquipmentSimcardPayment, setExistingEquipmentSimcardPayment] =
    useState<IEquipmentPayment[]>([]);
  const [existingSimcardPayment, setExistingSimcardPayment] = useState<
    ISimcardPayment[]
  >([]);
  const [existingServicePayment, setExistingServicePayment] = useState<
    IServicePayment[]
  >([]);

  const [priceTableStatus, setPriceTableStatus] =
    useState<StatusPriceTable | null>(null);

  const [priceTableName, setPriceTableName] = useState<string>("");

  const [groups, setGroups] = useState<Group[]>([
    { id: uid(), conditions: [createEmptyCondition()], priority: false },
  ]);

  const [messageErrorCondition, setMessageErrorCondition] = useState<{
    status: Status;
    message: string[];
  }>({ status: "red", message: [""] });

  const form = useForm<CreatePriceTableFormData>({
    resolver: zodResolver(priceTableSchema),
    defaultValues: {
      name: "",
      startDateTime: getDefaultStartDateTime(),
      endDateTime: undefined,
      isTemporary: false,
      groups: [
        {
          id: "",
          conditions: [
            { id: "", salesFor: [], toBillFor: "", billingLimit: "" },
          ],
          priority: false,
        },
      ],
      billingConfig: {
        salesFor: "",
        billingLimit: "",
        billTo: "",
      },
      equipmentWithSim: {},
      equipmentWithoutSim: {},
      simCards: [],
      accessories: {},
      services: [],
    },
  });

  const processExistingPaymentData = (
    equipmentPayment: IEquipmentPayment[]
  ) => {
    const equipmentWithSim: Record<string, any> = {};
    const equipmentWithoutSim: Record<string, any> = {};
    const accessories: Record<string, any> = {};

    equipmentPayment.forEach((payment) => {
      const isAccessory = payment.productId?.startsWith("ACC") || false;
      // All non-accessory items in this array go to either equipmentWithSim or equipmentWithoutSim
      // depending on which array this function is called with
      const targetCategory = isAccessory ? accessories : equipmentWithSim;

      if (!targetCategory[payment.productId]) {
        targetCategory[payment.productId] = {};
      }

      const paymentKey =
        payment.paymentType === "credit" ? "onDemand" : "onSight";

      if (isAccessory) {
        const priceKey =
          payment.paymentType === "credit" ? "singlePrice" : "cashPrice";
        const rangeKey =
          payment.paymentType === "credit"
            ? "useQuantityRange"
            : "useCashQuantityRange";
        const tiersKey =
          payment.paymentType === "credit" ? "priceTiers" : "cashPriceTiers";

        if (payment.type === "batch" && payment.priceRange.length > 0) {
          targetCategory[payment.productId][rangeKey] = true;
          targetCategory[payment.productId][tiersKey] = payment.priceRange.map(
            (range, index) => ({
              id: (index + 1).toString(),
              from: range.from.toString(),
              to:
                range.to === Number.MAX_SAFE_INTEGER ? "" : range.to.toString(),
              pricePerUnit: range.unitPrice.toString(),
              isLast: range.to === Number.MAX_SAFE_INTEGER,
            })
          );
        } else {
          targetCategory[payment.productId][rangeKey] = false;
          targetCategory[payment.productId][priceKey] =
            payment.unitPrice.toString();
        }
      } else {
        targetCategory[payment.productId][paymentKey] = payment;
      }
    });

    return { equipmentWithSim, equipmentWithoutSim, accessories };
  };

  useEffect(() => {
    if ((!editMode && !cloneMode) || !priceTableId) return;

    const loadPriceTable = async () => {
      try {
        setLoadingPriceTable(true);
        const existingPriceTable = await findOnePriceTable({
          id: priceTableId,
        });

        if (existingPriceTable) {
          setPriceTableStatus(
            cloneMode ? "DRAFT" : existingPriceTable.status || null
          );

          const tableName = cloneMode
            ? `${existingPriceTable.name} (Cópia)`
            : existingPriceTable.name || "";
          setPriceTableName(tableName);

          setExistingEquipmentPayment(
            existingPriceTable.equipmentPayment || []
          );
          setExistingEquipmentSimcardPayment(
            existingPriceTable.equipmentSimcardPayment || []
          );
          setExistingSimcardPayment(existingPriceTable.simcardPayment || []);
          setExistingServicePayment(existingPriceTable.servicePayment || []);

          const { equipmentWithoutSim, accessories } =
            processExistingPaymentData(
              existingPriceTable.equipmentPayment || []
            );

          const { equipmentWithSim } = processExistingPaymentData(
            existingPriceTable.equipmentSimcardPayment || []
          );

          // Para cloneMode, deixar datas em branco (usar default)
          const startDateTime = cloneMode
            ? getDefaultStartDateTime()
            : existingPriceTable.startDateTime
              ? new Date(existingPriceTable.startDateTime)
              : new Date();

          let endDateTime: Date | undefined;

          if (cloneMode) {
            // For clone mode: only set endDateTime if the original table is temporary
            endDateTime = existingPriceTable.isTemporary
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              : undefined;
          } else {
            // For edit mode: preserve existing logic
            if (existingPriceTable.isTemporary) {
              // If it's temporary, use existing endDateTime or set a default
              endDateTime = existingPriceTable.endDateTime
                ? new Date(existingPriceTable.endDateTime)
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            } else {
              // If it's not temporary, endDateTime should be undefined
              endDateTime = undefined;
            }
          }

          const formData = {
            name: tableName,
            startDateTime,
            endDateTime,
            isTemporary: existingPriceTable.isTemporary ?? false,
            billingConfig: { salesFor: "", billingLimit: "", billTo: "" },
            equipmentWithSim,
            groups: existingPriceTable.groups || [],
            equipmentWithoutSim,
            simCards: existingPriceTable.simcardPayment || [],
            accessories,
            services: existingPriceTable.servicePayment || [],
          };

          form.reset(formData);
        }
      } catch (error) {
        console.error("Error loading price table:", error);
        toast({
          variant: "error",
          title: "Erro",
          description: "Não foi possível carregar os dados da tabela de preço.",
        });
      } finally {
        setLoadingPriceTable(false);
      }
    };

    loadPriceTable();
  }, [editMode, cloneMode, priceTableId, form]);

  // Watch for name changes in the form and update the priceTableName state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name" && value.name !== undefined) {
        setPriceTableName(value.name);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Watch for isTemporary changes and clear endDateTime when set to false
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "isTemporary" && value.isTemporary !== undefined) {
        if (!value.isTemporary) {
          form.setValue("endDateTime", undefined);
        } else if (value.isTemporary && !value.endDateTime) {
          form.setValue(
            "endDateTime",
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          );
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Synchronize local groups state with form groups field
  useEffect(() => {
    form.setValue("groups", groups);
  }, [groups, form]);

  const createEquipmentPayment = (
    equipmentModel: string,
    prices: any,
    paymentType: "credit" | "upfront",
    type: "batch" | "unit"
  ) => {
    const priceRange =
      type === "batch"
        ? createPriceRange(
            paymentType === "upfront"
              ? prices.cashPriceTiers || []
              : prices.priceTiers || []
          )
        : [];

    const result = {
      type,
      paymentType,
      productId: equipmentModel,
      productName: equipmentModel,
      unitPrice:
        type === "unit"
          ? Number(prices.singlePrice || prices.cashPrice || 0)
          : 0,
      priceRange,
    };

    return result;
  };

  const handleEquipmentPriceChange = (
    equipmentModel: string,
    prices: any,
    type: "withSim" | "withoutSim"
  ) => {
    const currentData = form.getValues();
    const equipmentPayment: {
      onSight?: IEquipmentPayment;
      onDemand?: IEquipmentPayment;
    } = {};

    if (prices.useQuantityRange && prices.priceTiers?.length > 0) {
      equipmentPayment.onDemand = createEquipmentPayment(
        equipmentModel,
        prices,
        "credit",
        "batch"
      );
    } else if (prices.singlePrice) {
      equipmentPayment.onDemand = createEquipmentPayment(
        equipmentModel,
        prices,
        "credit",
        "unit"
      );
    }

    if (prices.useCashQuantityRange && prices.cashPriceTiers?.length > 0) {
      equipmentPayment.onSight = createEquipmentPayment(
        equipmentModel,
        prices,
        "upfront",
        "batch"
      );
    } else if (prices.cashPrice) {
      equipmentPayment.onSight = createEquipmentPayment(
        equipmentModel,
        prices,
        "upfront",
        "unit"
      );
    }

    const targetKey =
      type === "withSim" ? "equipmentWithSim" : "equipmentWithoutSim";
    form.setValue(targetKey, {
      ...currentData[targetKey],
      [equipmentModel]: equipmentPayment,
    });
  };

  const handleSimCardPriceChange = (prices: any) => {
    const simcardPayments: ISimcardPayment[] =
      prices.simCardTiers
        ?.filter(
          (tier: any) =>
            tier.carriers?.length > 0 &&
            tier.dataMB &&
            tier.type &&
            tier.supplier
        )
        .map((tier: any) => ({
          carriers: tier.carriers,
          dataAmountMb: Number(tier.dataMB.replace("MB", "")),
          planType: tier.type,
          provider: tier.supplier,
          priceWithoutDevice: Number(tier.priceWithoutEquipment) || 0,
          priceInBundle: Number(tier.priceInCombo) || 0,
        })) || [];

    form.setValue("simCards", simcardPayments);
  };

  const handleAccessoryPriceChange = (accessory: string, prices: any) => {
    const currentData = form.getValues();
    form.setValue("accessories", {
      ...currentData.accessories,
      [accessory]: prices,
    });
  };

  const handleServicePriceChange = (services: any[]) => {
    const transformedServices: IServicePayment[] = services
      .filter((service) => service.service)
      .map((service) => ({
        serviceId: service.service || "",
        monthlyPrice: service.monthlyPrice
          ? parseFloat(service.monthlyPrice)
          : undefined,
        yearlyPrice: service.annualPrice
          ? parseFloat(service.annualPrice)
          : undefined,
        fixedPrice: service.fixedPrice
          ? parseFloat(service.fixedPrice)
          : undefined,
      }));

    form.setValue("services", transformedServices);
  };

  const processEquipmentData = (
    equipment: Record<string, any>,
    equipmentPayment: IEquipmentPayment[]
  ) => {
    Object.entries(equipment).forEach(([productId, payment]) => {
      if (payment?.onSight) {
        const onSightPayment = {
          ...payment.onSight,
          paymentType: "upfront" as const,
        };
        equipmentPayment.push(onSightPayment);
      }
      if (payment?.onDemand) {
        const onDemandPayment = {
          ...payment.onDemand,
          paymentType: "credit" as const,
        };
        equipmentPayment.push(onDemandPayment);
      }
    });
  };

  const processAccessoryData = (
    accessories: Record<string, any>,
    equipmentPayment: IEquipmentPayment[]
  ) => {
    Object.entries(accessories).forEach(([accessoryId, accessoryData]) => {
      const accessoryPayment: any = accessoryData;

      const addPayment = (
        paymentType: "credit" | "upfront",
        useRange: string,
        tiers: string,
        singlePrice: string
      ) => {
        if (
          accessoryPayment?.[useRange] &&
          accessoryPayment?.[tiers]?.length > 0
        ) {
          equipmentPayment.push({
            type: "batch",
            paymentType,
            productId: accessoryId,
            productName: accessoryId,
            unitPrice: 0,
            priceRange: createPriceRange(accessoryPayment[tiers]),
          });
        } else if (accessoryPayment?.[singlePrice]) {
          equipmentPayment.push({
            type: "unit",
            paymentType,
            productId: accessoryId,
            productName: accessoryId,
            unitPrice: Number(accessoryPayment[singlePrice]),
            priceRange: [],
          });
        }
      };

      addPayment("credit", "useQuantityRange", "priceTiers", "singlePrice");
      addPayment(
        "upfront",
        "useCashQuantityRange",
        "cashPriceTiers",
        "cashPrice"
      );
    });
  };

  const transformToPriceTablePayload = (
    data: CreatePriceTableFormData,
    status: StatusPriceTable = "DRAFT"
  ): IPriceTable => {
    const equipmentPayment: IEquipmentPayment[] = [];
    const equipmentSimcardPayment: IEquipmentPayment[] = [];

    processEquipmentData(data.equipmentWithoutSim || {}, equipmentPayment);

    processEquipmentData(data.equipmentWithSim || {}, equipmentSimcardPayment);

    processAccessoryData(data.accessories || {}, equipmentPayment);

    // Ensure groups and conditions have salesFor as array (never undefined)
    const groups =
      (data.groups || []).map((group) => ({
        ...group,
        conditions: (group.conditions || []).map((condition) => ({
          ...condition,
          salesFor: condition.salesFor ?? [],
        })),
      })) ?? [];

    const payload: IPriceTable = {
      name: data.name,
      startDateTime: data.startDateTime,
      endDateTime: data.isTemporary ? data.endDateTime : undefined,
      isTemporary: data.isTemporary,
      status,
      equipmentPayment,
      equipmentSimcardPayment,
      simcardPayment: data.simCards || [],
      servicePayment: data.services || [],
      groups,
    };

    if (editMode && !cloneMode && priceTableId) {
      return { ...payload, id: priceTableId };
    }

    return payload;
  };

  const handleFormSubmission = async (
    data: CreatePriceTableFormData,
    status: StatusPriceTable = "DRAFT"
  ) => {
    try {
      const payload = transformToPriceTablePayload(data, status);

      // Use appropriate action based on edit mode and clone mode
      // Clone mode should always create, not update
      const result =
        editMode && !cloneMode
          ? await updateOnePriceTable(payload as IPriceTable)
          : await createOnePriceTable(
              payload as Omit<IPriceTable, "id" | "created_at" | "updated_at">
            );

      if (result?.success) {
        // Update price table status in state after successful save
        setPriceTableStatus(status);

        // Update payment data states after successful save
        if (payload.equipmentPayment) {
          setExistingEquipmentPayment(payload.equipmentPayment);
        }
        if (payload.equipmentSimcardPayment) {
          setExistingEquipmentSimcardPayment(payload.equipmentSimcardPayment);
        }
        if (payload.simcardPayment) {
          setExistingSimcardPayment(payload.simcardPayment);
        }
        if (payload.servicePayment) {
          setExistingServicePayment(payload.servicePayment);
        }

        const message =
          editMode && !cloneMode
            ? status === "DRAFT"
              ? "Alterações salvas!"
              : "Tabela de preços atualizada com sucesso!"
            : cloneMode
              ? "Tabela clonada com sucesso!"
              : status === "DRAFT"
                ? "Rascunho salvo!"
                : "Tabela de preços criada com sucesso!";

        const description =
          editMode && !cloneMode
            ? status === "DRAFT"
              ? "Suas alterações foram salvas como rascunho."
              : "Tabela de preços atualizada com sucesso!"
            : cloneMode
              ? "Tabela foi clonada e você foi redirecionado para editá-la."
              : status === "DRAFT"
                ? "Suas alterações foram salvas como rascunho."
                : "Tabela de preços criada com sucesso!";

        toast({ title: message, description, variant: "success" });

        if (
          (!editMode || cloneMode) &&
          result.success &&
          "id" in result &&
          result.id
        ) {
          router.push(`/commercial/price-table/form/edit/${result.id}`);
        }
      } else {
        const errorMsg =
          result?.error?.global || "Falha ao processar a tabela de preços!";
        toast({
          title: "Erro de Validação!",
          description: errorMsg,
          variant: "error",
        });

        ["name", "startDateTime", "endDateTime"].forEach((field) => {
          if (result?.error && field in result.error) {
            form.setError(field as keyof CreatePriceTableFormData, {
              message: (result.error as any)[field],
            });
          }
        });
      }
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Falha inesperada ao processar a tabela de preços!",
        variant: "error",
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const isValid = await form.trigger();

      if (!isValid) {
        const errors = form.formState.errors;
        let errorMessage = "Preencha todos os campos obrigatórios.";

        if (errors.name || errors.startDateTime || errors.endDateTime) {
          errorMessage =
            "Preencha os campos obrigatórios: nome, data de início e data de fim.";
        } else if (errors.groups) {
          errorMessage =
            "Preencha todos os campos obrigatórios nas condições de faturamento.";
        }

        toast({
          title: "Campos obrigatórios",
          description: errorMessage,
          variant: "error",
        });
        return;
      }

      const currentData = form.getValues();
      const adjustedData = {
        ...currentData,
        startDateTime: ensureFutureStartDate(currentData.startDateTime),
      };

      await handleFormSubmission(adjustedData, "DRAFT");
    } finally {
      setLoading(false);
    }
  };

  const handleValidationConditions = async () => {
    try {
      const groups = (form.getValues().groups || []).map((group: any) => ({
        ...group,
        conditions: (group.conditions || []).map((condition: any) => ({
          ...condition,
          salesFor: condition.salesFor ?? [],
        })),
      }));
      const result = await validateBillingConditionsPriceTable(groups);
      setMessageErrorCondition({
        status: result.status,
        message: result.messages ?? [],
      });
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Falha ao validar as condições!",
        variant: "error",
      });
    }
  };

  type Status = "red" | "yellow" | "green";

  const STATUS_STYLES: Record<Status, string> = {
    red: "bg-red-100 border-l-red-500 text-red-800",
    yellow: "bg-yellow-100 border-l-yellow-500 text-yellow-800",
    green: "bg-green-100 border-l-green-500 text-green-800",
  };

  const status = (messageErrorCondition.status ?? "red") as Status;

  const getCurrentFormData = () => {
    const data = form.getValues();
    return {
      formData: data,
      equipmentWithSim: Object.keys(data.equipmentWithSim || {}).length,
      groups: data.groups?.length || 0,
      equipmentWithoutSim: Object.keys(data.equipmentWithoutSim || {}).length,
      simCards: data.simCards?.length || 0,
      accessories: Object.keys(data.accessories || {}).length,
      services: data.services?.length || 0,
    };
  };

  return {
    form,
    handleSubmit,
    handleCancel: () => router.push("/commercial/price-table"),
    loading,
    loadingPriceTable,
    validateForm: () => form.trigger(),
    getFormErrors: () => form.formState.errors,
    isFormDirty: () => form.formState.isDirty,
    handleEquipmentPriceChange,
    handleSimCardPriceChange,
    handleAccessoryPriceChange,
    handleServicePriceChange,
    getDefaultStartDateTime: () =>
      formatDateTimeLocal(getDefaultStartDateTime()),
    getDefaultEndDateTime: () =>
      formatDateTimeLocal(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
    formatDateTimeLocal,
    getCurrentFormData,
    schema: priceTableSchema,
    handleValidationConditions,
    messageErrorCondition,
    STATUS_STYLES,
    status,
    existingEquipmentPayment,
    existingEquipmentSimcardPayment,
    existingSimcardPayment,
    existingServicePayment,
    priceTableStatus,
    priceTableName,
  };
}

export const BRAZILIAN_UF_LIST = [
  { id: "AC", text: "Acre" },
  { id: "AL", text: "Alagoas" },
  { id: "AP", text: "Amapá" },
  { id: "AM", text: "Amazonas" },
  { id: "BA", text: "Bahia" },
  { id: "CE", text: "Ceará" },
  { id: "DF", text: "Distrito Federal" },
  { id: "ES", text: "Espírito Santo" },
  { id: "GO", text: "Goiás" },
  { id: "MA", text: "Maranhão" },
  { id: "MT", text: "Mato Grosso" },
  { id: "MS", text: "Mato Grosso do Sul" },
  { id: "MG", text: "Minas Gerais" },
  { id: "PA", text: "Pará" },
  { id: "PB", text: "Paraíba" },
  { id: "PR", text: "Paraná" },
  { id: "PE", text: "Pernambuco" },
  { id: "PI", text: "Piauí" },
  { id: "RJ", text: "Rio de Janeiro" },
  { id: "RN", text: "Rio Grande do Norte" },
  { id: "RS", text: "Rio Grande do Sul" },
  { id: "RO", text: "Rondônia" },
  { id: "RR", text: "Roraima" },
  { id: "SC", text: "Santa Catarina" },
  { id: "SP", text: "São Paulo" },
  { id: "SE", text: "Sergipe" },
  { id: "TO", text: "Tocantins" },
];

export const TO_BILL_FOR_OPTIONS = [
  { id: "20.618.574/0002-16", text: "BWS - 20.618.574/0002-16" },
  { id: "41.459.104/0001-46", text: "HYBRID - 41.459.104/0001-46 (MATRIZ)" },
  { id: "41.459.104/0002-27", text: "HYBRID - 41.459.104/0002-27 (FILIAL MG)" },
  { id: "34.984.723/0001-94", text: "ICB - 34.984.723/0001-94 (MATRIZ)" },
  { id: "34.984.723/0002-75", text: "ICB - 34.984.723/0002-75 (FILIAL SP)" },
  { id: "34.984.723/0003-56", text: "ICB 34.984.723/0003-56 (FILIAL MG)" },
  { id: "31.941.680/0001-71", text: "MGC - 31.941.680/0001-71" },
  { id: "14.334.132/0001-64", text: "WFC - 14.334.132/0001-64" },
];

