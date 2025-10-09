"use server";

import { IProduct } from "@/app/lib/@backend/domain/commercial/entity/product.definition";
import { createOneProductUsecase } from "@/app/lib/@backend/usecase/commercial/product/product/create-one.product.usecase";
import { deleteOneProductUsecase } from "@/app/lib/@backend/usecase/commercial/product/product/delete-one.product.usecase";
import { findManyProductUsecase } from "@/app/lib/@backend/usecase/commercial/product/product/find-many.product.usecase";
import { findOneProductUsecase } from "@/app/lib/@backend/usecase/commercial/product/product/find-one.product.usecase";
import { updateOneProductUsecase } from "@/app/lib/@backend/usecase/commercial/product/product/update-one.product.usecase";
import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";

export async function createOneProduct(
  product: Omit<IProduct, "id" | "created_at" | "seq" | "sku">
) {
  const result = await createOneProductUsecase.execute(product);
  revalidatePath("/commercial/product");
  return result;
}

export async function findOneProduct(product: Partial<IProduct>) {
  return await findOneProductUsecase.execute(product);
}

export async function updateOneProductById(
  query: { id: string },
  value: Omit<IProduct, "id" | "created_at" | "seq" | "sku">
) {
  const result = await updateOneProductUsecase.execute(query, value);
  revalidatePath("/commercial/product");
  return result;
}

export async function deleteOneProductById(query: { id: string }) {
  await deleteOneProductUsecase.execute(query);
  revalidatePath("/commercial/product");
}

export async function findManyProduct(input: {
  filter: Filter<IProduct>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyProductUsecase.execute(input);
}
