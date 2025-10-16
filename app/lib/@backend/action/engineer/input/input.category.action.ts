"use server";

import { revalidatePath } from "next/cache";
import { createOneInputCategoryUsecase } from "@/backend/usecase/engineer/input/category/create-one.input.category.usecase";
import { deleteOneInputCategoryUsecase } from "@/backend/usecase/engineer/input/category/delete-one.input.category.usecase";
import { findManyInputCategoryUsecase } from "@/backend/usecase/engineer/input/category/find-many.input.category.usecase";
import { IInputCategory } from "@/backend/domain/engineer/entity/input.category.definition";
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

