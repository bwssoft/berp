"use server";

import { revalidatePath } from "next/cache";
import {
  createOneProductCategoryUsecase,
  deleteOneProductCategoryUsecase,
  findManyProductCategoryUsecase,
} from "@/app/lib/@backend/usecase";
import { IProductCategory } from "@/app/lib/@backend/domain";
import { Filter } from "mongodb";

export async function findManyProductCategory(input: {
  filter: Filter<IProductCategory>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyProductCategoryUsecase.execute(input);
}

export async function createOneProductCategory(
  productCategory: Omit<IProductCategory, "id" | "created_at">
) {
  const result = await createOneProductCategoryUsecase.execute(productCategory);
  revalidatePath("/commercial/product");
  return result;
}

export async function deleteOneProductCategoryById(params: { id: string }) {
  await deleteOneProductCategoryUsecase.execute(params);
  revalidatePath("/commercial/product");
}
