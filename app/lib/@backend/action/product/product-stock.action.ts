"use server"

import { revalidatePath } from "next/cache"
import { findAllProductStockUsecase, getProductStockInsightUsecase, getTotalValueProductStockUsecase, updateProductStockUsacase, analyzeTemporalProductStockUsecase } from "../../usecase"



export async function updateProductStock() {
  await updateProductStockUsacase.execute()
  revalidatePath("/product/stock")
  return
}

export async function findAllProductStock() {
  return await findAllProductStockUsecase.execute()
}

export async function getProductStockInsights() {
  return await getProductStockInsightUsecase.execute()
}

export async function getTotalValueInProductStock(product_id: string) {
  return await getTotalValueProductStockUsecase.execute(product_id)
}

export async function analyzeTemporalProductStock(product_id: string) {
  return await analyzeTemporalProductStockUsecase.execute(product_id)
}
