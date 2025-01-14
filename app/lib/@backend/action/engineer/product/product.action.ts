"use server";

import { IProduct } from "@/app/lib/@backend/domain";
import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";
import {
  createOneProductUsecase,
  deleteOneProductUsecase,
  findManyProductUsecase,
  findOneProductUsecase,
  findOneProductWithTechnicalSheetsUsecase,
  updateOneProductUsecase,
} from "@/app/lib/@backend/usecase";

export async function createOneProduct(
  args: Omit<IProduct, "id" | "created_at" | "code">
) {
  const product = await createOneProductUsecase.execute(args);
  revalidatePath("/engineer/product");
  return product;
}

export async function findOneProduct(input: Partial<IProduct>) {
  return await findOneProductUsecase.execute(input);
}

export async function updateOneProductById(
  query: { id: string },
  value: Omit<IProduct, "id" | "created_at" | "code">
) {
  await updateOneProductUsecase.execute(query, value);
  revalidatePath("/engineer/product");
}

export async function deleteOneProductById(query: { id: string }) {
  await deleteOneProductUsecase.execute(query);
  revalidatePath("/engineer/product");
}

export async function findManyProduct(
  params: Filter<IProduct> = {}
) {
  return await findManyProductUsecase.execute(params);
}

export async function findOneProductWithTechnicalSheets(
  input: Partial<IProduct>
) {
  return await findOneProductWithTechnicalSheetsUsecase.execute(input);
}
