"use server";

import { revalidatePath } from "next/cache";
import { createOneProductCategoryUsecase } from "@/app/lib/@backend/usecase/commercial/product/category/create-one.product.category.usecase";
import { deleteOneProductCategoryUsecase } from "@/app/lib/@backend/usecase/commercial/product/category/delete-one.product.category.usecase";
import { findManyProductCategoryUsecase } from "@/app/lib/@backend/usecase/commercial/product/category/find-many.product.category.usecase";
import { IProductCategory } from "@/app/lib/@backend/domain/commercial/entity/product.category.definition";
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
