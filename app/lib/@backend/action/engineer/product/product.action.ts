"use server";

import { IProduct } from "@/app/lib/@backend/domain";
import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";
import {
  createOneProductUsecase,
  deleteOneProductUsecase,
  findAllProductUsecase,
  findManyProductWithTechnicalSheetsUsecase,
  findOneProductUsecase,
  findOneProductWithTechnicalSheetsUsecase,
  updateOneProductUsecase,
} from "@/app/lib/@backend/usecase";

export async function createOneProduct(
  args: Omit<IProduct, "id" | "created_at" | "sequence">
) {
  const product = await createOneProductUsecase.execute(args);
  revalidatePath("/product");
  return product;
}

export async function findOneProduct(input: Partial<IProduct>) {
  return await findOneProductUsecase.execute(input);
}

export async function updateOneProductById(
  query: { id: string },
  value: Omit<IProduct, "id" | "created_at" | "sequence">
) {
  await updateOneProductUsecase.execute(query, value);
  revalidatePath("/product");
}

export async function deleteOneProductById(query: { id: string }) {
  await deleteOneProductUsecase.execute(query);
  revalidatePath("/product");
}

export async function findAllProduct(
  params: Filter<IProduct> = {}
): Promise<IProduct[]> {
  return await findAllProductUsecase.execute(params);
}

export async function findManyProductWithTechnicalSheets(
  params: Filter<IProduct> = {}
) {
  return await findManyProductWithTechnicalSheetsUsecase.execute(params);
}

export async function findOneProductWithTechnicalSheets(
  input: Partial<IProduct>
) {
  return await findOneProductWithTechnicalSheetsUsecase.execute(input);
}
