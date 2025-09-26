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
  validateHoldingEnterpriseNotInAnyGroup,
  validateControlledEnterprisesNotInHolding,
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
  initialControlled?: EconomicGroup[],
  economicGroupId?: string
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
  const validateHoldingEnterprise = async (
    holdingTaxId: string
  ): Promise<boolean> => {
    try {
      const cleanedTaxId = holdingTaxId.replace(/\D/g, "");

      const validationResult =
        await validateHoldingEnterpriseNotInAnyGroup(cleanedTaxId);

      if (!validationResult.isValid && validationResult.conflictingEntry) {
        const entry = validationResult.conflictingEntry;

        let errorMessage =
          "Não é possível selecionar esta empresa como holding:\n\n";

        if (entry.conflictType === "holding") {
          if (entry.economicGroupId === economicGroupId) {
            return true;
          }
          errorMessage += `⚠️ Esta empresa já é holding de outro grupo econômico:\n`;
          errorMessage += `• ${entry.name} (${entry.taxId}) - já é holding de um grupo existente\n`;
        } else if (entry.conflictType === "controlled") {
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
  const validateControlledEnterprises = async (
    selectedControlled: EconomicGroup[]
  ): Promise<boolean> => {
    if (!selectedControlled || selectedControlled.length === 0) {
      return true;
    }

    try {
      const controlledTaxIds = selectedControlled.map((item) =>
        item.taxId.replace(/\D/g, "")
      );

      // Check if any controlled enterprise is the same as the selected holding
      const currentSelectedHolding =
        selectedHolding.length > 0 ? selectedHolding[0] : null;
      if (currentSelectedHolding) {
        const holdingTaxId = currentSelectedHolding.taxId?.replace(/\D/g, "");
        if (holdingTaxId && controlledTaxIds.includes(holdingTaxId)) {
          toast({
            title: "Configuração Inválida",
            description: `A holding "${currentSelectedHolding.name}" não pode ser adicionada como empresa controlada.`,
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

  const debouncedValidationHolding = debounce(async (value: string) => {
    await handleCnpjOrName(value, "holding");
  }, 500);

  const debouncedValidationControlled = debounce(async (value: string) => {
    await handleCnpjOrName(value, "controlled");
  }, 500);

  const onSubmit = handleSubmit(async (formData) => {
    const holding = formData.economic_group.economic_group_holding;
    const controlled = formData.economic_group.economic_group_controlled || [];

    // Validate holding if provided
    if (holding) {
      const isHoldingValid = await validateHoldingEnterprise(holding.taxId);
      if (!isHoldingValid) {
        return; // Stop if holding validation fails
      }
    }

    // Only validate controlled enterprises that are new additions
    if (controlled.length > 0) {
      const initialControlledTaxIds = (initialControlled || []).map((item) =>
        item.taxId.replace(/\D/g, "")
      );

      const newlyAddedControlled = controlled.filter((item) => {
        const cleanTaxId = item.taxId.replace(/\D/g, "");
        return !initialControlledTaxIds.includes(cleanTaxId);
      });

      if (newlyAddedControlled.length > 0) {
        const isControlledValid =
          await validateControlledEnterprises(newlyAddedControlled);
        if (!isControlledValid) {
          return; // Stop if controlled validation fails
        }
      }
    }

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
        economic_group_holding: holding,
        economic_group_controlled: controlled,
      };

      let economicGroupResult;

      if (economicGroupId) {
        // Get existing economic group to compare for disconnections
        const existingEconomicGroup = await findOneAccountEconomicGroup({
          id: economicGroupId,
        });

        if (existingEconomicGroup) {
          const existingHolding = existingEconomicGroup.economic_group_holding;

          if (existingHolding && holding) {
            const existingHoldingTaxId = existingHolding.taxId?.replace(
              /\D/g,
              ""
            );
            const newHoldingTaxId = holding.taxId?.replace(/\D/g, "");

            // If holding has changed, disconnect the old one and connect the new one
            if (existingHoldingTaxId !== newHoldingTaxId) {
              try {
                // Disconnect the old holding account
                const oldHoldingAccount = await findOneAccount({
                  "document.value": existingHoldingTaxId,
                });

                if (oldHoldingAccount?.id) {
                  await updateOneAccount(
                    { id: oldHoldingAccount.id },
                    { economicGroupId: "" }
                  );
                }

                // Connect the new holding account (if it exists in the database)
                const newHoldingAccount = await findOneAccount({
                  "document.value": newHoldingTaxId,
                });

                if (newHoldingAccount?.id) {
                  await updateOneAccount(
                    { id: newHoldingAccount.id },
                    { economicGroupId: economicGroupId }
                  );
                }
              } catch (error) {
                console.warn(
                  "Failed to update holding account connections:",
                  error
                );
              }
            }
          } else if (existingHolding && !holding) {
            // If holding was removed, disconnect the old holding
            try {
              const oldHoldingAccount = await findOneAccount({
                "document.value": existingHolding.taxId?.replace(/\D/g, ""),
              });

              if (oldHoldingAccount?.id) {
                await updateOneAccount(
                  { id: oldHoldingAccount.id },
                  { economicGroupId: "" }
                );
              }
            } catch (error) {
              console.warn(
                "Failed to disconnect removed holding account:",
                error
              );
            }
          } else if (!existingHolding && holding) {
            // If holding was added, connect the new holding
            try {
              const newHoldingAccount = await findOneAccount({
                "document.value": holding.taxId?.replace(/\D/g, ""),
              });

              if (newHoldingAccount?.id) {
                await updateOneAccount(
                  { id: newHoldingAccount.id },
                  { economicGroupId: economicGroupId }
                );
              }
            } catch (error) {
              console.warn("Failed to connect new holding account:", error);
            }
          }

          const existingControlled =
            existingEconomicGroup.economic_group_controlled || [];
          const newControlledTaxIds = controlled.map((company) =>
            company.taxId.replace(/\D/g, "")
          );

          // Find companies that were removed from the controlled list
          const removedAccounts = existingControlled.filter((company) => {
            const cleanTaxId = company.taxId.replace(/\D/g, "");
            return !newControlledTaxIds.includes(cleanTaxId);
          });

          // Disconnect removed accounts from economic group
          if (removedAccounts.length > 0) {
            try {
              for (const removedAccount of removedAccounts) {
                // Find account by taxId first, then update by ID
                const accountToDisconnect = await findOneAccount({
                  "document.value": removedAccount.taxId,
                });

                if (accountToDisconnect?.id) {
                  await updateOneAccount(
                    { id: accountToDisconnect.id },
                    { economicGroupId: "" }
                  );
                }
              }
            } catch (error) {
              console.warn(
                "Failed to disconnect some accounts from economic group:",
                error
              );
            }
          }

          // Find companies that were added to the controlled list
          const existingControlledTaxIds = existingControlled.map((company) =>
            company.taxId.replace(/\D/g, "")
          );
          const addedAccounts = controlled.filter((company) => {
            const cleanTaxId = company.taxId.replace(/\D/g, "");
            return !existingControlledTaxIds.includes(cleanTaxId);
          });

          // Connect newly added accounts to economic group
          if (addedAccounts.length > 0) {
            try {
              for (const addedAccount of addedAccounts) {
                // Find account by taxId first, then update by ID
                const accountToConnect = await findOneAccount({
                  "document.value": addedAccount.taxId,
                });

                if (accountToConnect?.id) {
                  await updateOneAccount(
                    { id: accountToConnect.id },
                    { economicGroupId: economicGroupId }
                  );
                }
              }
            } catch (error) {
              console.warn(
                "Failed to connect some accounts to economic group:",
                error
              );
            }
          }
        }

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
          // Connect the main account to the economic group
          await updateOneAccount(
            { id: accountId },
            { economicGroupId: economicGroupResult.data.id }
          );

          // Connect the holding account to the economic group (if it exists in the database)
          if (holding) {
            try {
              const holdingAccount = await findOneAccount({
                "document.value": holding.taxId?.replace(/\D/g, ""),
              });

              if (holdingAccount?.id) {
                await updateOneAccount(
                  { id: holdingAccount.id },
                  { economicGroupId: economicGroupResult.data.id }
                );
              }
            } catch (error) {
              console.warn(
                "Failed to connect holding account to new economic group:",
                error
              );
            }
          }

          // Connect all controlled accounts to the economic group
          if (controlled.length > 0) {
            try {
              for (const controlledAccount of controlled) {
                // Find account by taxId first, then update by ID
                const accountToConnect = await findOneAccount({
                  "document.value": controlledAccount.taxId,
                });

                if (accountToConnect?.id) {
                  await updateOneAccount(
                    { id: accountToConnect.id },
                    { economicGroupId: economicGroupResult.data.id }
                  );
                }
              }
            } catch (error) {
              console.warn(
                "Failed to connect some controlled accounts to new economic group:",
                error
              );
            }
          }
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
    validateHoldingEnterprise,
    validateControlledEnterprises,
    dataControlled,
    setDataControlled,
    selectedHolding,
    setSelectedHolding,
    selectedControlled,
    setSelectedControlled,
    isLoading,
  };
}
