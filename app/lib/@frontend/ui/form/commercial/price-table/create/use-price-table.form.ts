"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib/@frontend/hook/use-toast";

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
    enabledProductsIds: z.array(z.string()).default([]),
    // Configurações de faturamento
    billingConfig: z
      .object({
        salesFor: z.string().optional(),
        billingLimit: z.string().optional(),
        billTo: z.string().optional(),
      })
      .optional(),
    // Dados de preços dos produtos
    equipmentWithSim: z.record(z.any()).default({}),
    equipmentWithoutSim: z.record(z.any()).default({}),
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

export function usePriceTableForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreatePriceTableFormData>({
    resolver: zodResolver(priceTableSchema),
    defaultValues: {
      name: "",
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isTemporary: false,
      conditionGroupIds: [],
      enabledProductsIds: [],
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

  // Handle equipment price changes
  const handleEquipmentPriceChange = (
    equipmentModel: string,
    prices: any,
    type: "withSim" | "withoutSim"
  ) => {
    const currentData = form.getValues();

    if (type === "withSim") {
      const updatedEquipmentWithSim = {
        ...currentData.equipmentWithSim,
        [equipmentModel]: prices,
      };
      form.setValue("equipmentWithSim", updatedEquipmentWithSim);
    } else {
      const updatedEquipmentWithoutSim = {
        ...currentData.equipmentWithoutSim,
        [equipmentModel]: prices,
      };
      form.setValue("equipmentWithoutSim", updatedEquipmentWithoutSim);
    }
  };

  // Handle SIM card price changes
  const handleSimCardPriceChange = (prices: any) => {
    form.setValue("simCards", prices.simCardTiers || []);
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

  // Handle services price changes
  const handleServicePriceChange = (prices: any) => {
    form.setValue("services", prices.serviceTiers || []);
  };

  const handleSubmit = form.handleSubmit(
    async (data: CreatePriceTableFormData) => {
      setLoading(true);

      try {
        // Transform data to match IPriceTable interface
        const priceTablePayload = {
          name: data.name,
          startDateTime: data.startDateTime,
          endDateTime: data.endDateTime,
          isTemporary: data.isTemporary,
          conditionGroupIds: data.conditionGroupIds,
          enabledProductsIds: data.enabledProductsIds,
          status: "rascunho" as const, // Default status for new tables
          // Additional data for price configurations
          billingConfig: data.billingConfig,
          pricing: {
            equipmentWithSim: data.equipmentWithSim,
            equipmentWithoutSim: data.equipmentWithoutSim,
            simCards: data.simCards,
            accessories: data.accessories,
            services: data.services,
          },
        };

        // Log the payload for debugging
        console.log(
          "Price Table Payload:",
          JSON.stringify(priceTablePayload, null, 2)
        );

        // TODO: Replace with actual API call
        // const { success, error } = await createPriceTable(priceTablePayload);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate success for now
        const success = true;
        const error = null;

        if (success) {
          toast({
            title: "Sucesso!",
            description: "Tabela de preços criada com sucesso!",
            variant: "success",
          });
          router.push("/commercial/price-table");
          return;
        }

        if (error) {
          // Handle field-specific errors
          if (typeof error === "object") {
            Object.entries(error).forEach(([key, message]) => {
              if (key !== "global" && message) {
                form.setError(key as keyof CreatePriceTableFormData, {
                  type: "manual",
                  message: message as string,
                });
              }
            });
          }

          toast({
            title: "Erro!",
            description:
              typeof error === "string"
                ? error
                : "Falha ao criar a tabela de preços!",
            variant: "error",
          });
        }
      } catch (error) {
        console.error("Error creating price table:", error);
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

  const handleSaveDraft = async () => {
    const currentData = form.getValues();

    try {
      // Create payload for draft save (less strict validation)
      const draftPayload = {
        ...currentData,
        status: "rascunho" as const,
      };

      console.log("Draft Payload:", JSON.stringify(draftPayload, null, 2));

      // TODO: Implement draft save API call
      toast({
        title: "Rascunho salvo!",
        description: "Suas alterações foram salvas como rascunho.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Erro!",
        description: "Falha ao salvar rascunho.",
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

  return {
    form,
    handleSubmit,
    handleSaveDraft,
    handleCancel,
    loading,
    validateForm,
    getFormErrors,
    isFormDirty,
    // Price change handlers
    handleEquipmentPriceChange,
    handleSimCardPriceChange,
    handleAccessoryPriceChange,
    handleServicePriceChange,
    // Schema for external validation
    schema: priceTableSchema,
  };
}
