"use server";

import { revalidatePath } from "next/cache";
import { IProductCategory } from "../../../domain";
import { createOneProductCategoryUsecase, deleteOneProductCategoryUsecase, findManyProductCategoriesUseCase } from "../../../usecase";


export async function findManyProductCategory(input: Partial<IProductCategory>): Promise<IProductCategory[]> {
  return await findManyProductCategoriesUseCase.execute(input)
}

export async function createOneProductCategory(inputCategory: Omit<IProductCategory, "id" | "created_at">) {
  await createOneProductCategoryUsecase.execute(inputCategory);
  revalidatePath("/engineer/product");
}

export async function deleteOneProductCategoryById(params: { id: string }) {
  await deleteOneProductCategoryUsecase.execute(params)
  revalidatePath("/engineer/product")
}