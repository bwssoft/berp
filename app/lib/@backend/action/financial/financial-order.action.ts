"use server"

import { revalidatePath } from "next/cache"
import { IFinancialOrder } from "../../domain"
import { createFinancialOrderFromProposalUsecase, deleteFinancialOrderUsecase, findOneFinancialOrderUsecase, createFinancialOrderOnOmieUsecase } from "../../usecase"

export async function findOneFinancialOrder(order: Partial<IFinancialOrder>) {
  return await findOneFinancialOrderUsecase.execute(order)
}

export async function createFinancialOrderOnOmie(input: { proposal_id: string, scenario_id: string }) {
  await createFinancialOrderOnOmieUsecase.execute(input)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}

export async function createFinancialOrderFromProposal(input: { scenario_id: string, proposal_id: string }) {
  await createFinancialOrderFromProposalUsecase.execute(input)
  revalidatePath(`/financial/order`)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}

export async function deleteFinancialOrder(input: { proposal_id: string, scenario_id: string }) {
  await deleteFinancialOrderUsecase.execute(input)
  revalidatePath(`/financial/order`)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}


