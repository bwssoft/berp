"use server";

import { revalidatePath } from "next/cache";
import { ITechnicalSheet } from "../domain";
import {
  createOneTechnicalSheetUsecase,
  deleteOneTechnicalSheetUsecase,
  findAllTechnicalSheetUsecase,
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

export async function findAllTechnicalSheet(): Promise<ITechnicalSheet[]> {
  return await findAllTechnicalSheetUsecase.execute();
}
