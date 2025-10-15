"use server";

import { Filter } from "mongodb";
import { IAccountEconomicGroup } from "../../domain/commercial/entity/account.economic-group.definition";
import { createOneAccountEconomicGroupUsecase } from "../../usecase/commercial/account-economic-group/create-one.account-economic-group.usecase";
import { findManyAccountEconomicGroupUsecase } from "../../usecase/commercial/account-economic-group/find-many.account-economic-group.usecase";
import { findOneAccountEconomicGroupUsecase } from "../../usecase/commercial/account-economic-group/find-one.account-economic-group.usecase";
import { updateOneAccountEconomicGroupUsecase } from "../../usecase/commercial/account-economic-group/update-one.account-economic-group.usecase";
import { deleteOneAccountEconomicGroupUsecase } from "../../usecase/commercial/account-economic-group/delete-one.account-economic-group.usecase";
import { revalidatePath } from "next/cache";

export async function createOneAccountEconomicGroup(
  accountEconomicGroup: Omit<IAccountEconomicGroup, "id">
) {
  const result =
    await createOneAccountEconomicGroupUsecase.execute(accountEconomicGroup);
  return result;
}

export async function updateOneAccountEconomicGroup(
  filter: Filter<IAccountEconomicGroup>,
  update: Partial<IAccountEconomicGroup>
) {
  const result = await updateOneAccountEconomicGroupUsecase.execute(
    filter,
    update
  );
  return result;
}

export const findOneAccountEconomicGroup = async (
  filter: Filter<IAccountEconomicGroup>
) => {
  return await findOneAccountEconomicGroupUsecase.execute(filter);
};

export async function findManyAccountEconomicGroup(
  filter: Filter<IAccountEconomicGroup> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyAccountEconomicGroupUsecase.execute({
    filter,
    page,
    limit,
    sort,
  });
}

export async function validateControlledEnterprisesNotInHolding(
  controlledTaxIds: string[]
): Promise<{
  isValid: boolean;
  conflictingEntries?: Array<{
    taxId: string;
    name: string;
    conflictType: "holding" | "controlled";
    holdingName?: string;
    holdingTaxId?: string;
    economicGroupId?: string;
  }>;
}> {
  try {
    // Find economic groups that contain any of the controlled tax IDs either as holding or controlled
    const existingGroups = await findManyAccountEconomicGroupUsecase.execute({
      filter: {
        $or: [
          { "economic_group_holding.taxId": { $in: controlledTaxIds } },
          { "economic_group_controlled.taxId": { $in: controlledTaxIds } },
        ],
      },
      page: 1,
      limit: 100, // Should be enough for most cases
    });

    if (!existingGroups.docs || existingGroups.docs.length === 0) {
      return { isValid: true };
    }

    // Check for conflicts
    const conflictingEntries: Array<{
      taxId: string;
      name: string;
      conflictType: "holding" | "controlled";
      holdingName?: string;
      holdingTaxId?: string;
      economicGroupId?: string;
    }> = [];

    existingGroups.docs.forEach((group) => {
      // Check if any of the controlled tax IDs is already a holding
      if (
        group.economic_group_holding &&
        controlledTaxIds.includes(group.economic_group_holding.taxId)
      ) {
        conflictingEntries.push({
          taxId: group.economic_group_holding.taxId,
          name: group.economic_group_holding.name,
          conflictType: "holding",
          economicGroupId: (group as any).id || undefined,
        });
      }

      // Check if any of the controlled tax IDs is already controlled in another group
      if (group.economic_group_controlled) {
        group.economic_group_controlled.forEach((controlled) => {
          if (controlledTaxIds.includes(controlled.taxId)) {
            conflictingEntries.push({
              taxId: controlled.taxId,
              name: controlled.name,
              conflictType: "controlled",
              holdingName: group.economic_group_holding?.name,
              holdingTaxId: group.economic_group_holding?.taxId,
            });
          }
        });
      }
    });

    return {
      isValid: conflictingEntries.length === 0,
      conflictingEntries:
        conflictingEntries.length > 0 ? conflictingEntries : undefined,
    };
  } catch (error) {
    console.error("Error validating controlled enterprises:", error);
    return { isValid: false };
  }
}

export async function validateHoldingEnterpriseNotInGroup(
  holdingTaxId: string
): Promise<{
  isValid: boolean;
  conflictingEntry?: {
    taxId: string;
    name: string;
    conflictType: "holding" | "controlled";
    holdingName?: string;
    holdingTaxId?: string;
    economicGroupId?: string;
  };
}> {
  try {
    const existingGroups = await findManyAccountEconomicGroupUsecase.execute({
      filter: {
        "economic_group_controlled.taxId": holdingTaxId,
      },
      page: 1,
      limit: 100, // Should be enough for most cases
    });

    if (!existingGroups.docs || existingGroups.docs.length === 0) {
      return { isValid: true };
    }

    // Check for conflicts - only if the enterprise is already controlled
    let conflictingEntry:
      | {
          taxId: string;
          name: string;
          conflictType: "holding" | "controlled";
          holdingName?: string;
          holdingTaxId?: string;
          economicGroupId?: string;
        }
      | undefined;

    for (const group of existingGroups.docs) {
      // Only check if the holding tax ID is already controlled in another group
      // (we allow selecting holdings that are already holdings)
      if (group.economic_group_controlled) {
        const controlledMatch = group.economic_group_controlled.find(
          (controlled) => controlled.taxId === holdingTaxId
        );
        if (controlledMatch) {
          conflictingEntry = {
            taxId: controlledMatch.taxId,
            name: controlledMatch.name,
            conflictType: "controlled",
            holdingName: group.economic_group_holding?.name,
            holdingTaxId: group.economic_group_holding?.taxId,
            economicGroupId: (group as any).id || undefined,
          };
          break;
        }
      }
    }

    return {
      isValid: !conflictingEntry,
      conflictingEntry,
    };
  } catch (error) {
    console.error("Error validating holding enterprise:", error);
    return { isValid: false };
  }
}

export async function validateHoldingEnterpriseNotInAnyGroup(
  holdingTaxId: string
): Promise<{
  isValid: boolean;
  conflictingEntry?: {
    taxId: string;
    name: string;
    conflictType: "holding" | "controlled";
    holdingName?: string;
    holdingTaxId?: string;
    economicGroupId?: string;
  };
}> {
  try {
    // For UPDATE: Check if the holding tax ID is already either holding OR controlled in any economic group
    const existingGroups = await findManyAccountEconomicGroupUsecase.execute({
      filter: {
        $or: [
          { "economic_group_holding.taxId": holdingTaxId },
          { "economic_group_controlled.taxId": holdingTaxId },
        ],
      },
      page: 1,
      limit: 100, // Should be enough for most cases
    });

    if (!existingGroups.docs || existingGroups.docs.length === 0) {
      return { isValid: true };
    }

    // Check for conflicts - both holding and controlled
    let conflictingEntry:
      | {
          taxId: string;
          name: string;
          conflictType: "holding" | "controlled";
          holdingName?: string;
          holdingTaxId?: string;
          economicGroupId?: string;
        }
      | undefined;

    for (const group of existingGroups.docs) {
      // Check if the holding tax ID is already a holding
      if (
        group.economic_group_holding &&
        group.economic_group_holding.taxId === holdingTaxId
      ) {
        conflictingEntry = {
          taxId: group.economic_group_holding.taxId,
          name: group.economic_group_holding.name,
          conflictType: "holding",
          economicGroupId: (group as any).id || undefined,
        };
        break;
      }

      // Check if the holding tax ID is already controlled
      if (group.economic_group_controlled) {
        const controlledMatch = group.economic_group_controlled.find(
          (controlled) => controlled.taxId === holdingTaxId
        );
        if (controlledMatch) {
          conflictingEntry = {
            taxId: controlledMatch.taxId,
            name: controlledMatch.name,
            conflictType: "controlled",
            holdingName: group.economic_group_holding?.name,
            holdingTaxId: group.economic_group_holding?.taxId,
            economicGroupId: (group as any).id || undefined,
          };
          break;
        }
      }
    }

    return {
      isValid: !conflictingEntry,
      conflictingEntry,
    };
  } catch (error) {
    console.error("Error validating holding enterprise:", error);
    return { isValid: false };
  }
}

export async function deleteOneAccountEconomicGroup(
  filter: Partial<IAccountEconomicGroup>
) {
  const result = await deleteOneAccountEconomicGroupUsecase.execute(filter);
  revalidatePath("/commercial");
  return result;
}
