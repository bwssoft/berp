"use server"

import { IProduct, IProductionOrder } from "../domain"
import {
  createOneProductionOrderUsecase,
  findOneProductionOrderUsecase,
  deleteOneProductionOrderUsecase,
  updateOneProductionOrderUsecase,
  findAllProductionOrderUsecase,
  findAllProductionOrderWithProductUsecase
} from "../usecase"


export async function createOneProductionOrder(productionOrder: Omit<IProductionOrder, "id" | "created_at">) {
  return await createOneProductionOrderUsecase.execute(productionOrder)
}

export async function findOneProductionOrder(productionOrder: Partial<IProductionOrder>) {
  return await findOneProductionOrderUsecase.execute(productionOrder)
}

export async function updateOneProductionOrderById(query: { id: string }, value: Omit<IProductionOrder, "id" | "created_at">) {
  return await updateOneProductionOrderUsecase.execute(query, value)
}

export async function deleteOneProductionOrderById(query: { id: string }) {
  return await deleteOneProductionOrderUsecase.execute(query)
}

export async function findAllProductionOrder(): Promise<IProductionOrder[]> {
  return await findAllProductionOrderUsecase.execute()
}

export async function findAllProductionOrderWithProduct(): Promise<(IProductionOrder & { _products: IProduct[] })[]> {
  return await findAllProductionOrderWithProductUsecase.execute()
}

