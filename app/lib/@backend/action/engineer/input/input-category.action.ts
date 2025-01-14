"use server";

import { revalidatePath } from "next/cache";
import { createManyCategoryUsecase, createOneInputCategoryUsecase, deleteOneInputCategoryUsecase, findAllInputCategoriesUseCase } from "@/app/lib/@backend/usecase";
import { IInputCategory } from "@/app/lib/@backend/domain";


export async function findAllInputCategories(): Promise<IInputCategory[]> {
  return await findAllInputCategoriesUseCase.execute()
}

export async function createOneInputCategory(inputCategory: Omit<IInputCategory, "id" | "created_at">) {
  await createOneInputCategoryUsecase.execute(inputCategory);
  revalidatePath("/engineer/input");
  return inputCategory
}

export async function createManyInputCategories(inputCategory: Omit<IInputCategory, "id" | "created_at">[]) {
  await createManyCategoryUsecase.execute(inputCategory);
  revalidatePath("/engineer/input")
  return inputCategory;
}

export async function deleteOneInputCategoryById(params: { id: string }) {
  await deleteOneInputCategoryUsecase.execute(params)
  revalidatePath("/engineer/input")
}