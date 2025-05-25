"use server";

import { IInput } from "@/app/lib/@backend/domain";
import {
  createOneInputUsecase,
  deleteOneInputUsecase,
  findManyInputUsecase,
  findOneInputUsecase,
  updateOneInputUsecase,
} from "@/app/lib/@backend/usecase";
import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";

export async function createOneInput(
  input: Omit<IInput, "id" | "created_at" | "seq" | "sku">
) {
  const result = await createOneInputUsecase.execute(input);
  revalidatePath("/engineer/input");
  return result;
}

export async function findOneInput(input: Partial<IInput>) {
  return await findOneInputUsecase.execute(input);
}

export async function updateOneInputById(
  query: { id: string },
  value: Omit<IInput, "id" | "created_at" | "seq" | "sku">
) {
  const result = await updateOneInputUsecase.execute(query, value);
  revalidatePath("/engineer/input");
  return result;
}

export async function deleteOneInputById(query: { id: string }) {
  await deleteOneInputUsecase.execute(query);
  revalidatePath("/engineer/input");
}

export async function findManyInput(input: {
  filter: Filter<IInput>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyInputUsecase.execute(input);
}
