"use server"

import { revalidatePath } from "next/cache"
import { IProduct, IProductionOrder, ISaleOrder } from "../domain"
import {
  createOneProductionOrderUsecase,
  findOneProductionOrderUsecase,
  deleteOneProductionOrderUsecase,
  updateOneProductionOrderUsecase,
  findAllProductionOrderUsecase,
  findAllProductionOrderWithProductUsecase
} from "../usecase"


export async function createOneProductionOrder(productionOrder: Omit<IProductionOrder, "id" | "created_at">) {
  await createOneProductionOrderUsecase.execute(productionOrder)
  revalidatePath("/production-order/management")
}

export async function findOneProductionOrder(productionOrder: Partial<IProductionOrder>) {
  return await findOneProductionOrderUsecase.execute(productionOrder)
}

export async function updateOneProductionOrderById(query: { id: string }, value: Omit<Partial<IProductionOrder>, "id" | "created_at">) {
  await updateOneProductionOrderUsecase.execute(query, value)
  revalidatePath("/production-order/management")
  revalidatePath("/production-order/kanban")
}

export async function deleteOneProductionOrderById(query: { id: string }) {
  await deleteOneProductionOrderUsecase.execute(query)
  revalidatePath("/production-order/management")
  revalidatePath("/production-order/kanban")
}

export async function findAllProductionOrder(): Promise<IProductionOrder[]> {
  return await findAllProductionOrderUsecase.execute()
}

export async function findAllProductionOrderWithProduct(): Promise<(IProductionOrder & { sale_order: ISaleOrder, products_in_sale_order: IProduct[] })[]> {
  return await findAllProductionOrderWithProductUsecase.execute()
}

