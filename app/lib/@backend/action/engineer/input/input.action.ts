"use server";

import { IInput } from "@/app/lib/@backend/domain/engineer/entity/input.definition";
import { createOneInputUsecase } from "@/app/lib/@backend/usecase/engineer/input/input/create-one.input.usecase";
import { deleteOneInputUsecase } from "@/app/lib/@backend/usecase/engineer/input/input/delete-one.input.usecase";
import { findManyInputUsecase } from "@/app/lib/@backend/usecase/engineer/input/input/find-many.input.usecase";
import { findOneInputUsecase } from "@/app/lib/@backend/usecase/engineer/input/input/find-one.input.usecase";
import { updateOneInputUsecase } from "@/app/lib/@backend/usecase/engineer/input/input/update-one.input.usecase";
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
