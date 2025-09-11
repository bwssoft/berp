"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import {
  createOnePriceTable,
  validateBillingConditionsPriceTable,
  findOnePriceTable,
} from "@/app/lib/@backend/action/commercial/price-table.action";
import {
  IEquipmentPayment,
  IPriceRange,
  ISimcardPayment,
  IServicePayment,
  StatusPriceTable,
} from "@/app/lib/@backend/domain/commercial/entity/price-table.definition";
import { IPriceTableCondition } from "@/app/lib/@backend/domain/commercial/entity/price-table-condition.definition";

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
    endDateTime: z.date({
      required_error: "Data e hora de fim são obrigatórias",
      invalid_type_error: "Data inválida",
    }),
    isTemporary: z.boolean().default(false),
    conditionGroupIds: z.array(z.string()).default([]),
    billingConfig: z
      .object({
        salesFor: z.string().optional(),
        billingLimit: z.string().optional(),
        billTo: z.string().optional(),
      })
      .optional(),
    equipmentWithSim: z.record(z.any()).default({}),
    equipmentWithoutSim: z.record(z.any()).default({}),
    simCards: z.array(z.any()).default([]),
    accessories: z.record(z.any()).default({}),
    services: z.array(z.any()).default([]),
  })
  .refine((data) => data.endDateTime > data.startDateTime, {
    message: "Data de fim deve ser posterior à data de início",
    path: ["endDateTime"],
  });

export type CreatePriceTableFormData = z.infer<typeof priceTableSchema>;

interface UsePriceTableFormProps {
  priceTableId?: string;
  editMode?: boolean;
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
}: UsePriceTableFormProps = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPriceTable, setLoadingPriceTable] = useState(!!priceTableId);

  const [existingEquipmentPayment, setExistingEquipmentPayment] = useState<
    IEquipmentPayment[]
  >([]);
  const [existingSimcardPayment, setExistingSimcardPayment] = useState<
    ISimcardPayment[]
  >([]);
  const [existingServicePayment, setExistingServicePayment] = useState<
    IServicePayment[]
  >([]);

  const [groups, setGroups] = useState<Group[]>([
    { id: uid(), conditions: [createEmptyCondition()], priority: false },
  ]);

  const [messageErrorCondition, setMessageErrorCondition] = useState<{
    status: string;
    message: string;
  }>({ status: "", message: "" });

  const form = useForm<CreatePriceTableFormData>({
    resolver: zodResolver(priceTableSchema),
    defaultValues: {
      name: "",
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isTemporary: false,
      conditionGroupIds: [],
      billingConfig: { salesFor: "", billingLimit: "", billTo: "" },
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
    if (!editMode || !priceTableId) return;

    const loadPriceTable = async () => {
      try {
        setLoadingPriceTable(true);
        const existingPriceTable = await findOnePriceTable({
          id: priceTableId,
        });

        if (existingPriceTable) {
          setExistingEquipmentPayment(
            existingPriceTable.equipmentPayment || []
          );
          setExistingSimcardPayment(existingPriceTable.simcardPayment || []);
          setExistingServicePayment(existingPriceTable.servicePayment || []);

          const { equipmentWithSim, equipmentWithoutSim, accessories } =
            processExistingPaymentData(
              existingPriceTable.equipmentPayment || []
            );

          const formData = {
            name: existingPriceTable.name || "",
            startDateTime: existingPriceTable.startDateTime
              ? new Date(existingPriceTable.startDateTime)
              : new Date(),
            endDateTime: existingPriceTable.endDateTime
              ? new Date(existingPriceTable.endDateTime)
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            isTemporary: existingPriceTable.isTemporary ?? false,
            conditionGroupIds: existingPriceTable.conditionGroupIds || [],
            billingConfig: { salesFor: "", billingLimit: "", billTo: "" },
            equipmentWithSim,
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
  }, [editMode, priceTableId, form]);

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
  ) => {
    const equipmentPayment: IEquipmentPayment[] = [];

    processEquipmentData(data.equipmentWithSim || {}, equipmentPayment);
    processEquipmentData(data.equipmentWithoutSim || {}, equipmentPayment);
    processAccessoryData(data.accessories || {}, equipmentPayment);

    return {
      name: data.name,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      isTemporary: data.isTemporary,
      conditionGroupIds: data.conditionGroupIds,
      status,
      equipmentPayment,
      simcardPayment: data.simCards || [],
      servicePayment: data.services || [],
    };
  };

  const handleFormSubmission = async (
    data: CreatePriceTableFormData,
    status: StatusPriceTable = "DRAFT"
  ) => {
    try {
      const payload = transformToPriceTablePayload(data, status);
      const result = await createOnePriceTable(payload);

      if (result?.success) {
        const message =
          status === "DRAFT"
            ? "Rascunho salvo!"
            : "Tabela de preços criada com sucesso!";
        const description =
          status === "DRAFT"
            ? "Suas alterações foram salvas como rascunho."
            : "Tabela de preços criada com sucesso!";

        toast({ title: message, description, variant: "success" });

        if (status !== "DRAFT") {
          router.push("/commercial/price-table");
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

  const handleSubmit = form.handleSubmit(
    async (data: CreatePriceTableFormData) => {
      setLoading(true);
      try {
        await handleFormSubmission(data, "DRAFT");
      } finally {
        setLoading(false);
      }
    }
  );

  const handleSaveDraft = async () => {
    const currentData = form.getValues();
    await handleFormSubmission(currentData, "DRAFT");
  };

  const handleValidationConditions = async () => {
    try {
      const result = await validateBillingConditionsPriceTable(groups);
      setMessageErrorCondition({
        status: result.status,
        message: result.messages[0] ?? "",
      });
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Falha ao validar as condições!",
        variant: "error",
      });
    }
  };

  const addGroup = () =>
    setGroups((prev) => [
      ...prev,
      { id: uid(), conditions: [createEmptyCondition()] },
    ]);

  const addCondition = (
    groupId: string,
    init?: Partial<IPriceTableCondition>
  ) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              conditions: [
                ...g.conditions,
                { ...createEmptyCondition(), ...init },
              ],
            }
          : g
      )
    );

  const removeCondition = (groupId: string, conditionId: string) => {
    setGroups((prev) => {
      const updated = prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              conditions: g.conditions.filter((c) => c.id !== conditionId),
            }
          : g
      );

      let pruned = updated.filter((g) => g.conditions.length > 0);

      if (pruned.length === 0) {
        pruned = [{ id: uid(), conditions: [createEmptyCondition()] }];
      }

      return pruned;
    });
  };

  const setGroupPriority = (groupId: string, enabled: boolean) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, priority: enabled } : g))
    );
  };

  const status = (messageErrorCondition.status ?? "red") as Status;

  const getCurrentFormData = () => {
    const data = form.getValues();
    return {
      formData: data,
      equipmentWithSim: Object.keys(data.equipmentWithSim || {}).length,
      equipmentWithoutSim: Object.keys(data.equipmentWithoutSim || {}).length,
      simCards: data.simCards?.length || 0,
      accessories: Object.keys(data.accessories || {}).length,
      services: data.services?.length || 0,
    };
  };

  return {
    form,
    handleSubmit,
    handleSaveDraft,
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
    getDefaultStartDateTime: () => formatDateTimeLocal(new Date()),
    getDefaultEndDateTime: () =>
      formatDateTimeLocal(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
    formatDateTimeLocal,
    getCurrentFormData,
    schema: priceTableSchema,
    addCondition,
    addGroup,
    groups,
    setGroups,
    handleValidationConditions,
    messageErrorCondition,
    STATUS_STYLES,
    status,
    removeCondition,
    setGroupPriority,
    existingEquipmentPayment,
    existingSimcardPayment,
    existingServicePayment,
  };
}
