"use server"

import { IProduct, IProductTransaction } from "@/app/lib/@backend/domain";
import { countProductTransactionUsecase, createOneProductTransactionUsecase, findAllProductTransactionWithProductUsecase } from "../../usecase";
import { revalidatePath } from "next/cache";

export async function createOneProductTransaction(args: Omit<IProductTransaction, "id" | "created_at">) {
  const product = createOneProductTransactionUsecase.execute(args)
  revalidatePath("/product/enter-exit")
  return product
}

export async function findAllProductTransactionWithProduct(): Promise<(IProductTransaction & { product: IProduct })[]> {
  return await findAllProductTransactionWithProductUsecase.execute()
}

export async function countProductTransaction(product_id?: string) {
  return await countProductTransactionUsecase.execute(product_id)
}



