"use server"

import { IProduct } from "@/app/lib/@backend/domain"
import { createOneProductUsecase, deleteOneProductUsecase, findAllProductUsecase, findOneProductUsecase, updateOneProductUsecase } from "../../usecase/product/product"
import { revalidatePath } from "next/cache"

export async function createOneProduct(args: Omit<IProduct, "id" | "created_at">) {
  const product = await createOneProductUsecase.execute(args)
  revalidatePath("/product")
  return product
}

export async function findOneProduct(input: Partial<IProduct>) {
  return await findOneProductUsecase.execute(input)
}

export async function updateOneProductById(query: { id: string }, value: Omit<IProduct, "id" | "created_at">) {
  await updateOneProductUsecase.execute(query, value)
  revalidatePath("/product")
}

export async function deleteOneProductById(query: { id: string }) {
  await deleteOneProductUsecase.execute(query)
  revalidatePath("/product")
}

export async function findAllProduct(): Promise<IProduct[]> {
  return await findAllProductUsecase.execute()
}

