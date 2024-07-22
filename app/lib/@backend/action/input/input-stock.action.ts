"use server"

import { analyzeTemporalInputStockUsecase, findAllInputStockUsecase, getInputStockInsightUsecase, getTotalValueInputStockUsecase, updateInputStockUsacase } from "../../usecase"


export async function updateInputStock() {
  await updateInputStockUsacase.execute()
}

export async function findAllInputStock() {
  return await findAllInputStockUsecase.execute()
}

export async function getInputStockInsight() {
  return await getInputStockInsightUsecase.execute()
}

export async function getTotalValueInInputStock(input_id: string) {
  return await getTotalValueInputStockUsecase.execute(input_id)
}

export async function analyzeTemporalInputStock(input_id: string) {
  return await analyzeTemporalInputStockUsecase.execute(input_id)
}

