"use server"

import { IFinancialOrder } from "../../domain"
import { findOneFinancialOrderUsecase } from "../../usecase"

export async function findOneOrder(order: Partial<IFinancialOrder>) {
  return await findOneFinancialOrderUsecase.execute(order)
}


