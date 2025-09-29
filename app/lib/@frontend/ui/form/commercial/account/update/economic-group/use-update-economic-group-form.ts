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
import { EconomicGroup, IAccount } from "@/app/lib/@backend/domain";
import { useAuth } from "@/app/lib/@frontend/context";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
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
  const [accountEconomicGroupEntry, setAccountEconomicGroupEntry] =
    useState<EconomicGroup | null>(null);
  const [selectedHoldingGroupId, setSelectedHoldingGroupId] =
    useState<string | null>(null);

  const buildAccountEntryFromAccount = useCallback((account?: IAccount | null) => {
    if (!account?.document?.value) {
      return null;
    }

    const sanitizedTaxId = account.document.value.replace(/\D/g, "");
    if (!sanitizedTaxId) {
      return null;
    }

    const accountName =
      account.name ||
      account.fantasy_name ||
      account.social_name ||
      account.document.value;

    return {
      name: accountName,
      taxId: sanitizedTaxId,
    };
  }, []);

  const ensureAccountEntry = useCallback(async () => {
    if (accountEconomicGroupEntry) {
      return accountEconomicGroupEntry;
    }

    try {
      const account = (await findOneAccount({ id: accountId })) as IAccount | null;
      const entry = buildAccountEntryFromAccount(account);
      if (entry) {
        setAccountEconomicGroupEntry(entry);
      }
      return entry;
    } catch (error) {
      console.error("Failed to load account entry for economic group:", error);
      return null;
    }
  }, [accountEconomicGroupEntry, accountId, buildAccountEntryFromAccount]);

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
          const accountData = (await findOneAccount({
            id: accountId,
          })) as IAccount | null;
          const accountEntry = buildAccountEntryFromAccount(accountData);
          if (accountEntry) {
            setAccountEconomicGroupEntry((current) => current ?? accountEntry);
          }

          const economicGroupId = accountData?.economicGroupId;
          setSelectedHoldingGroupId(economicGroupId ?? null);

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
  }, [
    isModalOpen,
    accountId,
    setValue,
    initialHolding,
    initialControlled,
    buildAccountEntryFromAccount,
  ]);

  useEffect(() => {
    if (selectedHolding.length === 0) {
      setSelectedHoldingGroupId(null);
      return;
    }

    let cancelled = false;

    const synchronizeHoldingGroup = async () => {
      const holding = selectedHolding[0];
      const holdingTaxId = holding?.taxId;

      if (!holdingTaxId) {
        setSelectedHoldingGroupId(null);
        return;
      }

      const cleanedHoldingTaxId = holdingTaxId.replace(/\D/g, "");
      if (!cleanedHoldingTaxId) {
        setSelectedHoldingGroupId(null);
        return;
      }

      setIsLoading(true);
      try {
        const [existingEconomicGroup, accountEntry] = await Promise.all([
          findOneAccountEconomicGroup({
            "economic_group_holding.taxId": cleanedHoldingTaxId,
          }),
          ensureAccountEntry(),
        ]);

        if (cancelled) {
          return;
        }

        const existingGroupId =
          (existingEconomicGroup as any)?.id ||
          (existingEconomicGroup as any)?._id ||
          null;

        setSelectedHoldingGroupId(existingGroupId ?? null);

        const shouldAdoptExistingControlled =
          !!existingEconomicGroup &&
          existingGroupId &&
          existingGroupId !== economicGroupId;

        if (shouldAdoptExistingControlled) {
          const dedup = new Map<string, EconomicGroup>();

          const registerEntry = (entry?: EconomicGroup | null) => {
            if (!entry) {
              return;
            }

            const cleanTaxId = entry.taxId?.replace(/\D/g, "");
            if (!cleanTaxId || cleanTaxId === cleanedHoldingTaxId) {
              return;
            }

            const normalizedName = entry.name?.trim() || cleanTaxId;
            dedup.set(cleanTaxId, {
              name: normalizedName,
              taxId: cleanTaxId,
            });
          };

          existingEconomicGroup?.economic_group_controlled?.forEach((company) => {
            registerEntry({
              name: company?.name ?? "",
              taxId: company?.taxId ?? "",
            });
          });

          registerEntry(accountEntry);

          const normalizedControlled = Array.from(dedup.values());

          if (normalizedControlled.length > 0) {
            setSelectedControlled(normalizedControlled);
            setValue(
              "economic_group.economic_group_controlled",
              normalizedControlled
            );
            setDataControlled(normalizedControlled);
          }
        }
      } catch (error) {
        console.error(
          "Failed to synchronize holding economic group:",
          error
        );
        if (!cancelled) {
          setSelectedHoldingGroupId(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    synchronizeHoldingGroup();

    return () => {
      cancelled = true;
    };
  }, [selectedHolding, economicGroupId, ensureAccountEntry, setValue]);

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
      setSelectedHoldingGroupId(null);

      const validationResult =
        await validateHoldingEnterpriseNotInAnyGroup(cleanedTaxId);

      if (!validationResult.isValid && validationResult.conflictingEntry) {
        const entry = validationResult.conflictingEntry;

        if (entry.conflictType === "holding") {
          setSelectedHoldingGroupId(entry.economicGroupId ?? null);
          return true;
        }

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
        const currentHoldingTaxId = selectedHolding.length
          ? selectedHolding[0]?.taxId?.replace(/\D/g, "")
          : undefined;

        const conflictsToReport = validationResult.conflictingEntries.filter(
          (entry) => {
            if (entry.conflictType === "controlled") {
              const conflictHoldingTaxId = entry.holdingTaxId?.replace(
                /\D/g,
                ""
              );

              if (
                currentHoldingTaxId &&
                conflictHoldingTaxId &&
                conflictHoldingTaxId === currentHoldingTaxId
              ) {
                return false;
              }
            }

            return true;
          }
        );

        if (conflictsToReport.length === 0) {
          return true;
        }

        // Group conflicts by type for better error messages
        const holdingConflicts = conflictsToReport.filter(
          (entry) => entry.conflictType === "holding"
        );
        const controlledConflicts = conflictsToReport.filter(
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
      const accountData = (await findOneAccount({
        id: accountId,
      })) as IAccount | null;
      const currentEconomicGroupId = accountData?.economicGroupId ?? null;

      const sanitizeTaxId = (value?: string | null) =>
        value ? value.replace(/\D/g, "") : "";

      const normalizedHolding: EconomicGroup = {
        name: holding.name?.trim() || sanitizeTaxId(holding.taxId),
        taxId: sanitizeTaxId(holding.taxId),
      };

      const normalizedControlledMap = new Map<string, EconomicGroup>();

      const registerControlled = (entry?: EconomicGroup | null) => {
        if (!entry) {
          return;
        }

        const cleanTaxId = sanitizeTaxId(entry.taxId);
        if (!cleanTaxId || cleanTaxId === normalizedHolding.taxId) {
          return;
        }

        const normalizedName = entry.name?.trim() || cleanTaxId;
        normalizedControlledMap.set(cleanTaxId, {
          name: normalizedName,
          taxId: cleanTaxId,
        });
      };

      controlled.forEach(registerControlled);

      const accountEntry =
        buildAccountEntryFromAccount(accountData) || accountEconomicGroupEntry;

      if (accountEntry) {
        registerControlled(accountEntry);
      }

      let normalizedControlled = Array.from(normalizedControlledMap.values());

      let targetEconomicGroupId =
        selectedHoldingGroupId || currentEconomicGroupId || null;

      let targetEconomicGroup =
        targetEconomicGroupId && targetEconomicGroupId !== ""
          ? await findOneAccountEconomicGroup({ id: targetEconomicGroupId })
          : null;

      if (!targetEconomicGroup && normalizedHolding.taxId) {
        targetEconomicGroup = await findOneAccountEconomicGroup({
          "economic_group_holding.taxId": normalizedHolding.taxId,
        });

        if (targetEconomicGroup?.id) {
          targetEconomicGroupId = targetEconomicGroup.id;
          setSelectedHoldingGroupId(targetEconomicGroup.id);
        }
      }

      if (targetEconomicGroupId && !targetEconomicGroup) {
        targetEconomicGroupId = null;
      }

      const connectAccountToGroup = async (
        taxId: string | undefined | null,
        groupId: string
      ) => {
        const cleanTaxId = sanitizeTaxId(taxId);
        if (!cleanTaxId) {
          return;
        }

        try {
          const accountToConnect = await findOneAccount({
            "document.value": cleanTaxId,
          });

          if (accountToConnect?.id) {
            await updateOneAccount(
              { id: accountToConnect.id },
              { economicGroupId: groupId }
            );
          }
        } catch (error) {
          console.warn(
            "Failed to connect account to economic group:",
            cleanTaxId,
            error
          );
        }
      };

      const disconnectAccountFromGroup = async (
        taxId: string | undefined | null
      ) => {
        const cleanTaxId = sanitizeTaxId(taxId);
        if (!cleanTaxId) {
          return;
        }

        try {
          const accountToDisconnect = await findOneAccount({
            "document.value": cleanTaxId,
          });

          if (accountToDisconnect?.id) {
            await updateOneAccount(
              { id: accountToDisconnect.id },
              { economicGroupId: "" }
            );
          }
        } catch (error) {
          console.warn(
            "Failed to disconnect account from economic group:",
            cleanTaxId,
            error
          );
        }
      };

      let economicGroupResult;

      if (!targetEconomicGroupId) {
        economicGroupResult = await createOneAccountEconomicGroup({
          economic_group_holding: normalizedHolding,
          economic_group_controlled: normalizedControlled,
        });

        if (!economicGroupResult.success || !economicGroupResult.data?.id) {
          throw new Error("Falha ao criar grupo econômico.");
        }

        targetEconomicGroupId = economicGroupResult.data.id;
        setSelectedHoldingGroupId(targetEconomicGroupId);

        await connectAccountToGroup(
          normalizedHolding.taxId,
          targetEconomicGroupId
        );

        for (const company of normalizedControlled) {
          await connectAccountToGroup(company.taxId, targetEconomicGroupId);
        }

        if (accountId) {
          await updateOneAccount(
            { id: accountId },
            { economicGroupId: targetEconomicGroupId }
          );
        }
      } else {
        const targetGroupData =
          targetEconomicGroup ||
          (await findOneAccountEconomicGroup({ id: targetEconomicGroupId }));

        if (!targetGroupData) {
          throw new Error("Grupo econômico alvo não encontrado.");
        }

        if (
          currentEconomicGroupId &&
          currentEconomicGroupId !== targetEconomicGroupId
        ) {
          const sanitizedAccountTaxId = sanitizeTaxId(
            accountData?.document?.value
          );

          if (sanitizedAccountTaxId) {
            try {
              const previousGroup = await findOneAccountEconomicGroup({
                id: currentEconomicGroupId,
              });

              if (previousGroup?.economic_group_controlled) {
                const filteredControlled =
                  previousGroup.economic_group_controlled.filter(
                    (company) =>
                      sanitizeTaxId(company?.taxId) !== sanitizedAccountTaxId
                  );

                if (
                  filteredControlled.length !==
                  previousGroup.economic_group_controlled.length
                ) {
                  await updateOneAccountEconomicGroup(
                    { id: currentEconomicGroupId },
                    { economic_group_controlled: filteredControlled }
                  );
                }
              }
            } catch (error) {
              console.warn(
                "Failed to remove account from previous economic group:",
                error
              );
            }
          }
        }

        const existingHolding = targetGroupData.economic_group_holding;
        const existingHoldingTaxId = sanitizeTaxId(existingHolding?.taxId);
        const newHoldingTaxId = normalizedHolding.taxId;

        if (existingHoldingTaxId && newHoldingTaxId) {
          if (existingHoldingTaxId !== newHoldingTaxId) {
            await disconnectAccountFromGroup(existingHoldingTaxId);
            await connectAccountToGroup(
              newHoldingTaxId,
              targetEconomicGroupId
            );
          }
        } else if (!existingHoldingTaxId && newHoldingTaxId) {
          await connectAccountToGroup(
            newHoldingTaxId,
            targetEconomicGroupId
          );
        } else if (existingHoldingTaxId && !newHoldingTaxId) {
          await disconnectAccountFromGroup(existingHoldingTaxId);
        }

        const existingControlled =
          targetGroupData.economic_group_controlled || [];

        if (
          normalizedControlled.length === 0 &&
          existingControlled.length > 0 &&
          (currentEconomicGroupId === null ||
            currentEconomicGroupId !== targetEconomicGroupId)
        ) {
          existingControlled.forEach((company) => {
            registerControlled({
              name: company?.name ?? "",
              taxId: company?.taxId ?? "",
            });
          });

          if (accountEntry) {
            registerControlled(accountEntry);
          }

          normalizedControlled = Array.from(normalizedControlledMap.values());
        }

        const existingControlledSanitized = existingControlled.map((company) => ({
          name: company?.name ?? "",
          taxId: sanitizeTaxId(company?.taxId),
        }));

        const existingControlledTaxIds = existingControlledSanitized.map(
          (company) => company.taxId
        );

        const newControlledTaxIds = normalizedControlled.map(
          (company) => company.taxId
        );

        const removedAccounts = existingControlledSanitized.filter(
          (company) =>
            company.taxId && !newControlledTaxIds.includes(company.taxId)
        );

        const addedAccounts = normalizedControlled.filter(
          (company) =>
            company.taxId && !existingControlledTaxIds.includes(company.taxId)
        );

        for (const removed of removedAccounts) {
          await disconnectAccountFromGroup(removed.taxId);
        }

        for (const added of addedAccounts) {
          await connectAccountToGroup(added.taxId, targetEconomicGroupId);
        }

        economicGroupResult = await updateOneAccountEconomicGroup(
          { id: targetEconomicGroupId },
          {
            economic_group_holding: normalizedHolding,
            economic_group_controlled: normalizedControlled,
          }
        );

        if (!economicGroupResult.success) {
          throw new Error("Falha ao atualizar grupo econômico.");
        }

        setSelectedHoldingGroupId(targetEconomicGroupId);

        if (accountId) {
          await updateOneAccount(
            { id: accountId },
            { economicGroupId: targetEconomicGroupId }
          );
        }
      }

      const effectiveEconomicGroupId =
        targetEconomicGroupId || economicGroupResult?.data?.id || null;

      queryClient.invalidateQueries({
        queryKey: ["findOneAccount", accountId],
      });

      if (
        currentEconomicGroupId &&
        currentEconomicGroupId !== effectiveEconomicGroupId
      ) {
        queryClient.invalidateQueries({
          queryKey: ["findOneAccountEconomicGroup", currentEconomicGroupId],
        });
      }

      if (effectiveEconomicGroupId) {
        queryClient.invalidateQueries({
          queryKey: ["findOneAccountEconomicGroup", effectiveEconomicGroupId],
        });
      }

      if (economicGroupResult?.success) {
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
