"use client";

import {
  fetchCnpjData,
  fetchNameData,
} from "@/app/lib/@backend/action/cnpja/cnpja.action";
import {
  findOneAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action/commercial/account.action";
import {
  createOneAccountEconomicGroup,
  updateOneAccountEconomicGroup,
  findOneAccountEconomicGroup,
} from "@/app/lib/@backend/action/commercial/account.economic-group.action";
import { createOneHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { EconomicGroup } from "@/app/lib/@backend/domain";
import { useAuth } from "@/app/lib/@frontend/context";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  economic_group: z.object({
    economic_group_holding: z
      .object({
        name: z.string().min(1, "CNPJ da holding é obrigatório"),
        taxId: z.string().min(1, "CNPJ da holding é obrigatório"),
      })
      .optional(),
    economic_group_controlled: z
      .array(
        z.object({
          name: z.string().min(1, "CNPJ do grupo controlado é obrigatório"),
          taxId: z.string().min(1, "CNPJ do grupo controlado é obrigatório"),
        })
      )
      .optional(),
  }),
});

export type UpdateEconomicGroupFormSchema = z.infer<typeof schema>;

export function useUpdateEconomicGroupForm(
  accountId: string,
  isModalOpen: boolean,
  closeModal?: () => void,
  initialHolding?: EconomicGroup,
  initialControlled?: EconomicGroup[]
) {
  const [dataHolding, setDataHolding] = useState<EconomicGroup[]>([]);
  const [dataControlled, setDataControlled] = useState<EconomicGroup[]>([]);
  const [selectedControlled, setSelectedControlled] = useState<EconomicGroup[]>(
    []
  );

  const [selectedHolding, setSelectedHolding] = useState<EconomicGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateEconomicGroupFormSchema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isModalOpen) return;

    if (initialHolding && Object.keys(initialHolding).length > 0) {
      setSelectedHolding([initialHolding]);
      setValue("economic_group.economic_group_holding", initialHolding);
    }

    if (initialControlled && initialControlled.length > 0) {
      setSelectedControlled(initialControlled);
      setValue("economic_group.economic_group_controlled", initialControlled);
    }

    // If initial values aren't provided, fetch them from the economic group entity
    if (!initialHolding || !initialControlled) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // First get the account to find the economicGroupId
          const accountData = await findOneAccount({ id: accountId });
          const economicGroupId = accountData?.economicGroupId;

          if (economicGroupId) {
            // Then fetch the economic group data using the ID
            const economicGroupData = await findOneAccountEconomicGroup({
              id: economicGroupId,
            });
            const holding = economicGroupData?.economic_group_holding;
            const controlled = economicGroupData?.economic_group_controlled;

            if (!initialHolding && holding && Object.keys(holding).length > 0) {
              setSelectedHolding([holding]);
              setValue("economic_group.economic_group_holding", holding);
            }

            if (!initialControlled && controlled) {
              setSelectedControlled(controlled || []);
              setValue("economic_group.economic_group_controlled", controlled);
            }
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isModalOpen, accountId, setValue, initialHolding, initialControlled]);

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

    const normalized = Array.isArray(data)
      ? data
          .filter(
            (item) => item && item.taxId && item.company && item.company.name
          )
          .map((item) => ({
            taxId: item?.taxId.replace(/\D/g, "") || "",
            name: item?.company?.name || "",
          }))
      : [];

    if (groupType === "controlled") {
      setDataControlled(normalized);
    } else {
      setDataHolding(normalized);
    }
  };

  const debouncedValidationHolding = debounce(async (value: string) => {
    await handleCnpjOrName(value, "holding");
  }, 500);

  const debouncedValidationControlled = debounce(async (value: string) => {
    await handleCnpjOrName(value, "controlled");
  }, 500);

  const onSubmit = handleSubmit(async (formData) => {
    const holding = formData.economic_group.economic_group_holding;
    const controlled = formData.economic_group.economic_group_controlled || [];

    if (!holding) {
      toast({
        title: "Erro!",
        description: "Holding inválida ou não encontrada!",
        variant: "error",
      });
      return;
    }

    try {
      // First get the account to find the economicGroupId
      const accountData = await findOneAccount({ id: accountId });
      const economicGroupId = accountData?.economicGroupId;

      const economicGroupPayload = {
        accountId,
        economic_group_holding: holding,
        economic_group_controlled: controlled,
      };

      let economicGroupResult;

      if (economicGroupId) {
        economicGroupResult = await updateOneAccountEconomicGroup(
          { id: economicGroupId },
          {
            economic_group_holding: holding,
            economic_group_controlled: controlled,
          }
        );
      } else {
        economicGroupResult =
          await createOneAccountEconomicGroup(economicGroupPayload);

        if (economicGroupResult.success && economicGroupResult.data?.id) {
          await updateOneAccount(
            { id: accountId },
            { economicGroupId: economicGroupResult.data.id }
          );
        }
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["findOneAccount", accountId],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "findOneAccountEconomicGroup",
          economicGroupId || economicGroupResult.data?.id,
        ],
      });

      if (economicGroupResult.success) {
        try {
          let historicalTitle = "Grupos econômicos atualizados.";

          if (holding && controlled.length > 0) {
            historicalTitle = `Grupo econômico (Holding) "${holding.name}" e ${controlled.length} empresa${controlled.length > 1 ? "s" : ""} controlada${controlled.length > 1 ? "s" : ""} vinculado${controlled.length > 1 ? "s" : ""}.`;
          } else if (holding) {
            historicalTitle = `Grupo econômico (Holding) "${holding.name}" vinculado.`;
          } else if (controlled.length > 0) {
            const controlledNames = controlled
              .map((c: { name: string; taxId: string }) => c.name)
              .join(", ");
            historicalTitle = `${controlled.length} empresa${controlled.length > 1 ? "s" : ""} controlada${controlled.length > 1 ? "s" : ""} "${controlledNames}" vinculada${controlled.length > 1 ? "s" : ""}.`;
          }

          await createOneHistorical({
            accountId: String(accountId),
            title: historicalTitle,
            editedFields: [
              {
                key: "economic_group_holding",
                newValue: holding ? `${holding.name} (${holding.taxId})` : "",
                oldValue: initialHolding
                  ? `${initialHolding.name} (${initialHolding.taxId})`
                  : "",
              },
              {
                key: "economic_group_controlled",
                newValue: controlled
                  .map(
                    (c: { name: string; taxId: string }) =>
                      `${c.name} (${c.taxId})`
                  )
                  .join(", "),
                oldValue: initialControlled
                  ? initialControlled
                      .map(
                        (c: { name: string; taxId: string }) =>
                          `${c.name} (${c.taxId})`
                      )
                      .join(", ")
                  : "",
              },
            ],
            type: "manual",
            author: {
              name: user?.name ?? "",
              avatarUrl: "",
            },
          });
          console.log(
            "Economic group update historical entry created successfully"
          );
        } catch (error) {
          console.warn(
            "Failed to create economic group update historical entry:",
            error
          );
        }
      }

      toast({
        title: "Sucesso!",
        description: "Grupos econômicos atualizados com sucesso!",
        variant: "success",
      });

      closeModal?.();
    } catch (error) {
      console.error("Economic group update error:", error);
      toast({
        title: "Erro!",
        description: "Falha ao atualizar os grupos econômicos!",
        variant: "error",
      });
    }
  });

  return {
    control,
    onSubmit,
    dataHolding,
    setDataHolding,
    debouncedValidationHolding,
    debouncedValidationControlled,
    dataControlled,
    setDataControlled,
    selectedHolding,
    setSelectedHolding,
    selectedControlled,
    setSelectedControlled,
    isLoading,
  };
}
