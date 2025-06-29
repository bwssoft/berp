"use server";

import { revalidatePath } from "next/cache";
import {
  createOneInputCategoryUsecase,
  deleteOneInputCategoryUsecase,
  findManyInputCategoryUsecase,
} from "@/app/lib/@backend/usecase";
import { IInputCategory } from "@/app/lib/@backend/domain";
import { Filter } from "mongodb";

export async function findManyInputCategory(input: {
  filter: Filter<IInputCategory>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyInputCategoryUsecase.execute(input);
}

export async function createOneInputCategory(
  inputCategory: Omit<IInputCategory, "id" | "created_at">
) {
  const result = await createOneInputCategoryUsecase.execute(inputCategory);
  revalidatePath("/engineer/input");
  revalidatePath("/engineer/input/category");
  return result;
}

export async function deleteOneInputCategoryById(params: { id: string }) {
  await deleteOneInputCategoryUsecase.execute(params);
  revalidatePath("/engineer/input");
}
