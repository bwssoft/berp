"use server"

import { ISaleOrder } from "../../domain"
import { findOneSaleOrderUsecase } from "../../usecase"




export async function findOneSaleOrder(saleOrder: Partial<ISaleOrder>) {
  return await findOneSaleOrderUsecase.execute(saleOrder)
}


