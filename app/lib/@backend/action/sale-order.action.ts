"use server"

import { revalidatePath } from "next/cache"
import { ISaleOrder } from "../domain"
import {
  createOneSaleOrderUsecase,
  findOneSaleOrderUsecase,
  deleteOneSaleOrderUsecase,
  updateOneSaleOrderUsecase,
  findAllSaleOrderUsecase,
} from "../usecase"


export async function createOneSaleOrder(saleOrder: Omit<ISaleOrder, "id" | "created_at">) {
  await createOneSaleOrderUsecase.execute(saleOrder)
  revalidatePath("/sale-order/management")
}

export async function findOneSaleOrder(saleOrder: Partial<ISaleOrder>) {
  return await findOneSaleOrderUsecase.execute(saleOrder)
}

export async function updateOneSaleOrderById(query: { id: string }, value: Omit<ISaleOrder, "id" | "created_at">) {
  await updateOneSaleOrderUsecase.execute(query, value)
  revalidatePath("/sale-order/management")
}

export async function deleteOneSaleOrderById(query: { id: string }) {
  await deleteOneSaleOrderUsecase.execute(query)
  revalidatePath("/sale-order/management")
}

export async function findAllSaleOrder(): Promise<ISaleOrder[]> {
  return await findAllSaleOrderUsecase.execute()
}
