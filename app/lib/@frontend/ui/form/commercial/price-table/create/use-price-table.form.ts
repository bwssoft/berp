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
    endDateTime: z.date({
      required_error: "Data e hora de fim são obrigatórias",
      invalid_type_error: "Data inválida",
    }),
    isTemporary: z.boolean().default(false),
    conditionGroupIds: z.array(z.string()).default([]),
    // Configurações de faturamento
    billingConfig: z
      .object({
        salesFor: z.string().optional(),
        billingLimit: z.string().optional(),
        billTo: z.string().optional(),
      })
      .optional(),
    // Dados de preços dos produtos com tipos específicos
    equipmentWithSim: z.record(z.any()).default({}), // Record<string, IEquipmentPayment>
    equipmentWithoutSim: z.record(z.any()).default({}), // Record<string, IEquipmentPayment>
    simCards: z.array(z.any()).default([]),
    accessories: z.record(z.any()).default({}),
    services: z.array(z.any()).default([]),
  })
  .refine(
    (data) => {
      return data.endDateTime > data.startDateTime;
    },
    {
      message: "Data de fim deve ser posterior à data de início",
      path: ["endDateTime"],
    }
  );

export type CreatePriceTableFormData = z.infer<typeof priceTableSchema>;

interface UsePriceTableFormProps {
  priceTableId?: string;
  editMode?: boolean;
}

export function usePriceTableForm({
  priceTableId,
  editMode = false,
}: UsePriceTableFormProps = {}) {
  type Group = {
    id: string;
    conditions: IPriceTableCondition[];
    priority?: boolean;
  };

  const uid = () =>
    crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const emptyCondition = (): IPriceTableCondition => ({
    id: uid(),
    salesFor: [],
    billingLimit: "",
    toBillFor: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPriceTable, setLoadingPriceTable] = useState(!!priceTableId);

  // States for loaded pricing data
  const [existingEquipmentPayment, setExistingEquipmentPayment] = useState<
    IEquipmentPayment[]
  >([]);
  const [existingSimcardPayment, setExistingSimcardPayment] = useState<
    ISimcardPayment[]
  >([]);
  const [existingServicePayment, setExistingServicePayment] = useState<
    IServicePayment[]
  >([]);

  // state para grupos e condições
  const [groups, setGroups] = useState<Group[]>([
    { id: uid(), conditions: [emptyCondition()], priority: false },
  ]);
  const [messageErrorCondition, setMessageErrorCondition] = useState<{
    status: string;
    message: string;
  }>({
    status: "",
    message: "",
  });

  const form = useForm<CreatePriceTableFormData>({
    resolver: zodResolver(priceTableSchema),
    defaultValues: {
      name: "",
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isTemporary: false,
      conditionGroupIds: [],
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

  // Load existing price table data for edit mode
  useEffect(() => {
    if (!editMode || !priceTableId) return;

    const loadPriceTable = async () => {
      try {
        setLoadingPriceTable(true);
        const existingPriceTable = await findOnePriceTable({
          id: priceTableId,
        });

        if (existingPriceTable) {
          // Store existing pricing data in separate states
          setExistingEquipmentPayment(
            existingPriceTable.equipmentPayment || []
          );
          setExistingSimcardPayment(existingPriceTable.simcardPayment || []);
          setExistingServicePayment(existingPriceTable.servicePayment || []);

          const equipmentWithSim: Record<string, any> = {};
          const equipmentWithoutSim: Record<string, any> = {};
          const accessories: Record<string, any> = {};

          (existingPriceTable.equipmentPayment || []).forEach((payment) => {
            const isAccessory = payment.productId?.startsWith("ACC") || false; // Update this logic as needed

            if (isAccessory) {
              if (!accessories[payment.productId]) {
                accessories[payment.productId] = {};
              }

              if (payment.paymentType === "credit") {
                if (payment.type === "batch" && payment.priceRange.length > 0) {
                  accessories[payment.productId].useQuantityRange = true;
                  accessories[payment.productId].priceTiers =
                    payment.priceRange.map((range, index) => ({
                      id: (index + 1).toString(),
                      from: range.from.toString(),
                      to:
                        range.to === Number.MAX_SAFE_INTEGER
                          ? ""
                          : range.to.toString(),
                      pricePerUnit: range.unitPrice.toString(),
                      isLast: range.to === Number.MAX_SAFE_INTEGER,
                    }));
                } else {
                  accessories[payment.productId].useQuantityRange = false;
                  accessories[payment.productId].singlePrice =
                    payment.unitPrice.toString();
                }
              } else if (payment.paymentType === "upfront") {
                // This is "pagamento à vista" - upfront payment
                if (payment.type === "batch" && payment.priceRange.length > 0) {
                  accessories[payment.productId].useCashQuantityRange = true;
                  accessories[payment.productId].cashPriceTiers =
                    payment.priceRange.map((range, index) => ({
                      id: (index + 1).toString(),
                      from: range.from.toString(),
                      to:
                        range.to === Number.MAX_SAFE_INTEGER
                          ? ""
                          : range.to.toString(),
                      pricePerUnit: range.unitPrice.toString(),
                      isLast: range.to === Number.MAX_SAFE_INTEGER,
                    }));
                } else {
                  accessories[payment.productId].useCashQuantityRange = false;
                  accessories[payment.productId].cashPrice =
                    payment.unitPrice.toString();
                }
              }
            } else {
              // Handle equipment - for now, assume all equipment is "withSim" category
              // You may need to adjust this logic based on your actual categorization
              const equipmentCategory = equipmentWithSim; // or determine based on productId/productName

              if (!equipmentCategory[payment.productId]) {
                equipmentCategory[payment.productId] = {};
              }

              if (payment.paymentType === "credit") {
                // This goes to "onDemand" (a prazo)
                equipmentCategory[payment.productId].onDemand = {
                  type: payment.type,
                  paymentType: payment.paymentType,
                  productId: payment.productId,
                  productName: payment.productName,
                  unitPrice: payment.unitPrice,
                  priceRange: payment.priceRange,
                };
              } else if (payment.paymentType === "upfront") {
                // This goes to "onSight" (à vista)
                equipmentCategory[payment.productId].onSight = {
                  type: payment.type,
                  paymentType: payment.paymentType,
                  productId: payment.productId,
                  productName: payment.productName,
                  unitPrice: payment.unitPrice,
                  priceRange: payment.priceRange,
                };
              }
            }
          });

          // Reset form with existing data - map to form format
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
            billingConfig: {
              salesFor: "",
              billingLimit: "",
              billTo: "",
            },
            // Use transformed data structures
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

  // Helper function to format date for datetime-local input
  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Get formatted default values for datetime inputs
  const getDefaultStartDateTime = () => formatDateTimeLocal(new Date());
  const getDefaultEndDateTime = () =>
    formatDateTimeLocal(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));

  // Handle equipment price changes - transform to IEquipmentPayment format
  const handleEquipmentPriceChange = (
    equipmentModel: string,
    prices: any,
    type: "withSim" | "withoutSim"
  ) => {
    const currentData = form.getValues();

    // Transform the data to IEquipmentPayment format
    const equipmentPayment: {
      onSight?: IEquipmentPayment;
      onDemand?: IEquipmentPayment;
    } = {};

    // Handle credit payment (pagamento a prazo)
    if (prices.useQuantityRange && prices.priceTiers?.length > 0) {
      // Batch pricing with quantity ranges
      const priceRange: IPriceRange[] = prices.priceTiers
        .filter((tier: any) => tier.from && tier.pricePerUnit)
        .map((tier: any) => ({
          from: Number(tier.from),
          to: tier.isLast ? Number.MAX_SAFE_INTEGER : Number(tier.to),
          unitPrice: Number(tier.pricePerUnit),
        }));

      equipmentPayment.onDemand = {
        type: "batch",
        paymentType: "credit", // a prazo = credit
        productId: equipmentModel, // Use equipment model as productId for now
        productName: equipmentModel, // Use equipment model as productName for now
        unitPrice: 0, // Not used for batch pricing
        priceRange,
      };
    } else if (prices.singlePrice) {
      // Unit pricing
      equipmentPayment.onDemand = {
        type: "unit",
        paymentType: "credit", // a prazo = credit
        productId: equipmentModel, // Use equipment model as productId for now
        productName: equipmentModel, // Use equipment model as productName for now
        unitPrice: Number(prices.singlePrice),
        priceRange: [],
      };
    }

    // Handle cash payment (pagamento à vista)
    if (prices.useCashQuantityRange && prices.cashPriceTiers?.length > 0) {
      // Batch pricing with quantity ranges
      const priceRange: IPriceRange[] = prices.cashPriceTiers
        .filter((tier: any) => tier.from && tier.pricePerUnit)
        .map((tier: any) => ({
          from: Number(tier.from),
          to: tier.isLast ? Number.MAX_SAFE_INTEGER : Number(tier.to),
          unitPrice: Number(tier.pricePerUnit),
        }));

      equipmentPayment.onSight = {
        type: "batch",
        paymentType: "upfront", // à vista = upfront
        productId: equipmentModel, // Use equipment model as productId for now
        productName: equipmentModel, // Use equipment model as productName for now
        unitPrice: 0, // Not used for batch pricing
        priceRange,
      };
    } else if (prices.cashPrice) {
      // Unit pricing
      equipmentPayment.onSight = {
        type: "unit",
        paymentType: "upfront", // à vista = upfront
        productId: equipmentModel, // Use equipment model as productId for now
        productName: equipmentModel, // Use equipment model as productName for now
        unitPrice: Number(prices.cashPrice),
        priceRange: [],
      };
    }

    if (type === "withSim") {
      const updatedEquipmentWithSim = {
        ...currentData.equipmentWithSim,
        [equipmentModel]: equipmentPayment,
      };
      form.setValue("equipmentWithSim", updatedEquipmentWithSim);
    } else {
      const updatedEquipmentWithoutSim = {
        ...currentData.equipmentWithoutSim,
        [equipmentModel]: equipmentPayment,
      };
      form.setValue("equipmentWithoutSim", updatedEquipmentWithoutSim);
    }
  };

  // Handle SIM card price changes - transform to ISimcardPayment format
  const handleSimCardPriceChange = (prices: any) => {
    // Transform simCardTiers to ISimcardPayment format
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
          dataAmountMb: Number(tier.dataMB.replace("MB", "")), // Convert "10MB" to 10
          planType: tier.type,
          provider: tier.supplier,
          priceWithoutDevice: Number(tier.priceWithoutEquipment) || 0,
          priceInBundle: Number(tier.priceInCombo) || 0,
        })) || [];

    form.setValue("simCards", simcardPayments);
  };

  // Handle accessories price changes
  const handleAccessoryPriceChange = (accessory: string, prices: any) => {
    const currentData = form.getValues();
    const updatedAccessories = {
      ...currentData.accessories,
      [accessory]: prices,
    };
    form.setValue("accessories", updatedAccessories);
  };

  // Handle services price changes - transform to IServicePayment format
  const handleServicePriceChange = (services: any[]) => {
    // Transform service data to match IServicePayment interface
    const transformedServices: IServicePayment[] = services
      .filter((service: any) => service.service) // Only include services with a selected serviceId
      .map((service: any) => ({
        serviceId: service.service || "", // The selected service acts as serviceId
        monthlyPrice: service.monthlyPrice
          ? parseFloat(service.monthlyPrice)
          : undefined,
        yearlyPrice: service.annualPrice
          ? parseFloat(service.annualPrice)
          : undefined, // Map annualPrice to yearlyPrice
        fixedPrice: service.fixedPrice
          ? parseFloat(service.fixedPrice)
          : undefined,
      }));

    // Update the form data
    form.setValue("services", transformedServices);
  };

  // Helper function to transform form data to IPriceTable payload
  const transformToPriceTablePayload = (
    data: CreatePriceTableFormData,
    status: StatusPriceTable = "DRAFT"
  ) => {
    // Transform equipment data from nested objects to arrays
    const equipmentPayment: IEquipmentPayment[] = [];

    // Add equipment with SIM
    Object.entries(data.equipmentWithSim || {}).forEach(
      ([productId, payment]) => {
        if (payment?.onSight) {
          equipmentPayment.push({
            ...payment.onSight,
            paymentType: "upfront" as const, // à vista = upfront
          });
        }
        if (payment?.onDemand) {
          equipmentPayment.push({
            ...payment.onDemand,
            paymentType: "credit" as const, // a prazo = credit
          });
        }
      }
    );

    // Add equipment without SIM
    Object.entries(data.equipmentWithoutSim || {}).forEach(
      ([productId, payment]) => {
        if (payment?.onSight) {
          equipmentPayment.push({
            ...payment.onSight,
            paymentType: "upfront" as const, // à vista = upfront
          });
        }
        if (payment?.onDemand) {
          equipmentPayment.push({
            ...payment.onDemand,
            paymentType: "credit" as const, // a prazo = credit
          });
        }
      }
    );

    // Add accessories to equipment payment
    Object.entries(data.accessories || {}).forEach(
      ([accessoryId, accessoryData]) => {
        // Transform accessory data to IEquipmentPayment format
        const accessoryPayment: any = accessoryData;

        // Handle credit payment (pagamento a prazo) for accessories
        if (
          accessoryPayment?.useQuantityRange &&
          accessoryPayment?.priceTiers?.length > 0
        ) {
          const priceRange: IPriceRange[] = accessoryPayment.priceTiers
            .filter((tier: any) => tier.from && tier.pricePerUnit)
            .map((tier: any) => ({
              from: Number(tier.from),
              to: tier.isLast ? Number.MAX_SAFE_INTEGER : Number(tier.to),
              unitPrice: Number(tier.pricePerUnit),
            }));

          equipmentPayment.push({
            type: "batch" as const,
            paymentType: "credit" as const, // a prazo = credit
            productId: accessoryId,
            productName: accessoryId,
            unitPrice: 0,
            priceRange,
          });
        } else if (accessoryPayment?.singlePrice) {
          equipmentPayment.push({
            type: "unit" as const,
            paymentType: "credit" as const, // a prazo = credit
            productId: accessoryId,
            productName: accessoryId,
            unitPrice: Number(accessoryPayment.singlePrice),
            priceRange: [],
          });
        }

        // Handle cash payment (pagamento à vista) for accessories
        if (
          accessoryPayment?.useCashQuantityRange &&
          accessoryPayment?.cashPriceTiers?.length > 0
        ) {
          const priceRange: IPriceRange[] = accessoryPayment.cashPriceTiers
            .filter((tier: any) => tier.from && tier.pricePerUnit)
            .map((tier: any) => ({
              from: Number(tier.from),
              to: tier.isLast ? Number.MAX_SAFE_INTEGER : Number(tier.to),
              unitPrice: Number(tier.pricePerUnit),
            }));

          equipmentPayment.push({
            type: "batch" as const,
            paymentType: "upfront" as const, // à vista = upfront
            productId: accessoryId,
            productName: accessoryId,
            unitPrice: 0,
            priceRange,
          });
        } else if (accessoryPayment?.cashPrice) {
          equipmentPayment.push({
            type: "unit" as const,
            paymentType: "upfront" as const, // à vista = upfront
            productId: accessoryId,
            productName: accessoryId,
            unitPrice: Number(accessoryPayment.cashPrice),
            priceRange: [],
          });
        }
      }
    );

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

  const handleSubmit = form.handleSubmit(
    async (data: CreatePriceTableFormData) => {
      setLoading(true);

      try {
        // Transform data to match IPriceTable interface exactly
        const priceTablePayload = transformToPriceTablePayload(data, "DRAFT");

        // Call the actual API action
        const result = await createOnePriceTable(priceTablePayload);

        // Check if the creation was successful
        if (result?.success) {
          toast({
            title: "Sucesso!",
            description: "Tabela de preços criada com sucesso!",
            variant: "success",
          });
          router.push("/commercial/price-table");
        } else {
          // Handle validation errors from the backend
          const errorMsg =
            result?.error?.global || "Falha ao criar a tabela de preços!";
          toast({
            title: "Erro de Validação!",
            description: errorMsg,
            variant: "error",
          });

          // Set form errors if available
          if (result?.error?.name) {
            form.setError("name", { message: result.error.name });
          }
          if (result?.error?.startDateTime) {
            form.setError("startDateTime", {
              message: result.error.startDateTime,
            });
          }
          if (result?.error?.endDateTime) {
            form.setError("endDateTime", { message: result.error.endDateTime });
          }
        }
      } catch (error) {
        toast({
          title: "Erro!",
          description: "Falha inesperada ao criar a tabela de preços!",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  );

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
        description: "Falha ao criar a tabela de preços!",
        variant: "error",
      });
    }
  };

  // adicionar novo GRUPO
  const addGroup = () =>
    setGroups((prev) => [
      ...prev,
      { id: uid(), conditions: [emptyCondition()] },
    ]);

  // adicionar nova CONDIÇÃO dentro de um grupo
  const addCondition = (
    groupId: string,
    init?: Partial<IPriceTableCondition>
  ) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              conditions: [...g.conditions, { ...emptyCondition(), ...init }],
            }
          : g
      )
    );

  const removeCondition = (groupId: string, conditionId: string) => {
    setGroups((prev) => {
      // 1) remove a condição do grupo alvo
      const updated = prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              conditions: g.conditions.filter((c) => c.id !== conditionId),
            }
          : g
      );

      // 2) remove grupos que ficaram sem condições
      let pruned = updated.filter((g) => g.conditions.length > 0);

      // 3) se não sobrar nenhum grupo, mantém 1 grupo com 1 condição vazia (coloquei isso pq é obrigatório ter pelo menos 1 condição)
      if (pruned.length === 0) {
        pruned = [{ id: uid(), conditions: [emptyCondition()] }];
      }

      return pruned;
    });
  };

  const handleSaveDraft = async () => {
    const currentData = form.getValues();

    try {
      // Create payload for draft save
      const draftPayload = transformToPriceTablePayload(currentData, "DRAFT");

      // Call the actual API action
      const result = await createOnePriceTable(draftPayload);

      // Check if the save was successful
      if (result?.success) {
        toast({
          title: "Rascunho salvo!",
          description: "Suas alterações foram salvas como rascunho.",
          variant: "success",
        });
      } else {
        // Handle validation errors from the backend
        const errorMsg = result?.error?.global || "Falha ao salvar rascunho.";

        toast({
          title: "Erro de Validação!",
          description: errorMsg,
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Falha inesperada ao salvar rascunho.",
        variant: "error",
      });
    }
  };

  const handleCancel = () => {
    router.push("/commercial/price-table");
  };

  // Helper function to validate current form state
  const validateForm = () => {
    return form.trigger();
  };

  // Helper function to get form errors
  const getFormErrors = () => {
    return form.formState.errors;
  };

  // Helper function to check if form is dirty
  const isFormDirty = () => {
    return form.formState.isDirty;
  };

  type Status = "red" | "yellow" | "green" | "blue";

  const STATUS_STYLES: Record<Status, string> = {
    red: "bg-red-100 border-l-red-500 text-red-800",
    yellow: "bg-yellow-100 border-l-yellow-500 text-yellow-800",
    green: "bg-green-100 border-l-green-500 text-green-800",
    blue: "bg-blue-100 border-l-blue-500 text-blue-800",
  };

  const status = (messageErrorCondition.status ?? "red") as Status;

  const setGroupPriority = (groupId: string, enabled: boolean) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, priority: enabled } : g))
    );
  };

  // Helper function to get current form values for debugging
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
    handleCancel,
    loading,
    loadingPriceTable,
    validateForm,
    getFormErrors,
    isFormDirty,
    // Price change handlers
    handleEquipmentPriceChange,
    handleSimCardPriceChange,
    handleAccessoryPriceChange,
    handleServicePriceChange,
    // Helper functions
    getDefaultStartDateTime,
    getDefaultEndDateTime,
    formatDateTimeLocal,
    getCurrentFormData,
    // Schema for external validation
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
    // Existing pricing data for edit mode
    existingEquipmentPayment,
    existingSimcardPayment,
    existingServicePayment,
  };
}
