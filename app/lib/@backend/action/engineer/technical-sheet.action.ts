"use server";

import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";
import { ITechnicalSheet } from "@/backend/domain/engineer/entity/technical-sheet.definition";
import { createOneTechnicalSheetUsecase } from "@/backend/usecase/engineer/technical-sheet/create-one-technical-sheet.usecase";
import { deleteOneTechnicalSheetUsecase } from "@/backend/usecase/engineer/technical-sheet/delete-one-technical-sheet.usecase";
import { findAllTechnicalSheetUsecase } from "@/backend/usecase/engineer/technical-sheet/find-all-technical-sheet.usecase";
import { findOneTechnicalSheetUsecase } from "@/backend/usecase/engineer/technical-sheet/find-one-technical-sheet.usecase";
import { updateOneTechnicalSheetUsecase } from "@/backend/usecase/engineer/technical-sheet/update-one-technical-sheet.usecase";

export async function createOneTechnicalSheet(
  productionProcess: Omit<ITechnicalSheet, "id" | "created_at">
) {
  await createOneTechnicalSheetUsecase.execute(productionProcess);
  revalidatePath("/engineer/technical-sheet");
  revalidatePath("/production/production-order/management");
}

export async function findOneTechnicalSheet(
  productionProcess: Partial<ITechnicalSheet>
) {
  return await findOneTechnicalSheetUsecase.execute(productionProcess);
}

export async function updateOneTechnicalSheetById(
  query: { id: string },
  value: Omit<Partial<ITechnicalSheet>, "id" | "created_at">
) {
  await updateOneTechnicalSheetUsecase.execute(query, value);
  revalidatePath("/production/production-order/management");
}

export async function deleteOneTechnicalSheetById(query: { id: string }) {
  await deleteOneTechnicalSheetUsecase.execute(query);
  revalidatePath("/production/production-order/management");
}

export async function findAllTechnicalSheet(
  params: Filter<ITechnicalSheet>
): Promise<ITechnicalSheet[]> {
  return await findAllTechnicalSheetUsecase.execute(params);
}

