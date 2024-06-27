"use server"

import { IProductionOrder } from "../definition/production-order.definition";
import productionOrderRepository from "../repository/mongodb/production-order.repository";

const repository = productionOrderRepository

export async function createOneProductionOrder(productionOrder: Omit<IProductionOrder, "id" | "created_at">) {
  await repository.create({ ...productionOrder, created_at: new Date(), id: crypto.randomUUID() })
  return productionOrder
}

export async function findOneProductionOrder(productionOrder: Partial<IProductionOrder>) {
  return await repository.findOne(productionOrder)
}

export async function updateOneProductionOrderById(query: { id: string }, value: Omit<IProductionOrder, "id" | "created_at">) {
  return await repository.updateOne(query, value)
}

export async function deleteOneProductionOrderById(query: { id: string }) {
  return await repository.deleteOne(query)
}

export async function findAllProductionOrder(): Promise<IProductionOrder[]> {
  return await repository.findAll() as IProductionOrder[]
}

