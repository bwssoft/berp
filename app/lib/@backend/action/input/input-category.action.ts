"use server";

import { revalidatePath } from "next/cache";
import { IInputCategory } from "../../domain/engineer/entity/input-category.definition";
import { createManyCategoryUsecase } from "../../usecase/input/category/create-many-category.usecase";
import { createOneInputCategoryUsecase } from "../../usecase/input/category/create-one-category.usecase";
import { deleteOneInputCategoryUsecase } from "../../usecase/input/category/delete-one-category.usecase";
import { findAllInputCategoriesUseCase } from "../../usecase/input/category/find-all-category.usecase";

export async function findAllInputCategories(): Promise<IInputCategory[]> {
  return await findAllInputCategoriesUseCase.execute()
}

export async function createOneInputCategory(inputCategory: Omit<IInputCategory, "id" | "created_at">) {
  await createOneInputCategoryUsecase.execute(inputCategory);
  revalidatePath("/path");
  return inputCategory
}

export async function createManyInputCategories(inputCategory: Omit<IInputCategory, "id" | "created_at">[]) {
  await createManyCategoryUsecase.execute(inputCategory);
  revalidatePath("/input")
  return inputCategory;
}

export async function deleteOneInputCategoryById(params: { id: string }) {
  await deleteOneInputCategoryUsecase.execute(params)
  revalidatePath("/input")
}