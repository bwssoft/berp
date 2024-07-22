"use server"

import { IProduct } from "@/app/lib/@backend/domain"
import { createOneProductUsecase, deleteOneProductUsecase, findAllProductUsecase, findOneProductUsecase, updateOneProductUsecase } from "../../usecase/product/product"

export async function createOneProduct(args: Omit<IProduct, "id" | "created_at">) {
  const product = await createOneProductUsecase.execute(args)
  return product
}

export async function findOneProduct(input: Partial<IProduct>) {
  return await findOneProductUsecase.execute(input)
}

export async function updateOneProductById(query: { id: string }, value: Omit<IProduct, "id" | "created_at">) {
  return await updateOneProductUsecase.execute(query, value)
}

export async function deleteOneProductById(query: { id: string }) {
  return await deleteOneProductUsecase.execute(query)
}

export async function findAllProduct(): Promise<IProduct[]> {
  return await findAllProductUsecase.execute()
}

