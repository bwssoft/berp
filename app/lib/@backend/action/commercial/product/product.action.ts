"use server";

import { IProduct } from "@/app/lib/@backend/domain";
import {
  createOneProductUsecase,
  deleteOneProductUsecase,
  findManyProductUsecase,
  findOneProductUsecase,
  updateOneProductUsecase,
} from "@/app/lib/@backend/usecase";
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
