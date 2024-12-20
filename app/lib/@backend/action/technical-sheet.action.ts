"use server";

import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";
import { ITechnicalSheet } from "../domain";
import {
  createOneTechnicalSheetUsecase,
  deleteOneTechnicalSheetUsecase,
  findAllTechnicalSheetUsecase,
  findManyTechnicalSheetWithInputsUsecase,
  findOneTechnicalSheetUsecase,
  updateOneTechnicalSheetUsecase,
} from "../usecase";

export async function createOneTechnicalSheet(
  productionProcess: Omit<ITechnicalSheet, "id" | "created_at">
) {
  await createOneTechnicalSheetUsecase.execute(productionProcess);
  revalidatePath("/production-order/management");
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
  revalidatePath("/production-order/management");
}

export async function deleteOneTechnicalSheetById(query: { id: string }) {
  await deleteOneTechnicalSheetUsecase.execute(query);
  revalidatePath("/production-order/management");
}

export async function findAllTechnicalSheet(
  params: Filter<ITechnicalSheet>
): Promise<ITechnicalSheet[]> {
  return await findAllTechnicalSheetUsecase.execute(params);
}

export async function findManyTechnicalSheetWithInputs(
  params: Filter<ITechnicalSheet>
) {
  return await findManyTechnicalSheetWithInputsUsecase.execute(params);
}
