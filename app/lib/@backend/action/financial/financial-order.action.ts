"use server"

import { revalidatePath } from "next/cache"
import { IFinancialOrder } from "@/app/lib/@backend/domain/financial/entity/financial-order.definition";
import { createFinancialOrderFromProposalUsecase } from "@/app/lib/@backend/usecase/financial/order/create-financial-order-from-proposal.usecase";
import { deleteFinancialOrderUsecase } from "@/app/lib/@backend/usecase/financial/order/delete-financial-order.usecase";
import { findOneFinancialOrderUsecase } from "@/app/lib/@backend/usecase/financial/order/find-one-financial-order.usecase";
import { createFinancialOrderOnOmieUsecase } from "@/app/lib/@backend/usecase/financial/order/create-financial-order-on-omie.usecase";
import { updateFinancialOrderFromProposalUsecase } from "@/app/lib/@backend/usecase/financial/order/update-financial-order-from-proposal.usecase"

export async function findOneFinancialOrder(order: Partial<IFinancialOrder>) {
  return await findOneFinancialOrderUsecase.execute(order)
}

export async function createFinancialOrderOnOmie(input: { proposal_id: string, scenario_id: string }) {
  await createFinancialOrderOnOmieUsecase.execute(input)
  revalidatePath(`/commercial/proposal/form/update?id=${input.proposal_id}`)
}

export async function deleteFinancialOrder(input: { proposal_id: string, scenario_id: string }) {
  await deleteFinancialOrderUsecase.execute(input)
  revalidatePath(`/commercial/financial/order`)
  revalidatePath(`/commercial/proposal/form/update?id=${input.proposal_id}`)
}

export async function createFinancialOrderFromProposal(input: { scenario_id: string, proposal_id: string }) {
  await createFinancialOrderFromProposalUsecase.execute(input)
  revalidatePath(`/commercial/financial/order`)
  revalidatePath(`/commercial/proposal/form/update?id=${input.proposal_id}`)
}

export async function updateOneFinancialOrderFromProposal(query: { id: string }, value: Partial<IFinancialOrder>, proposal_id: string) {
  await updateFinancialOrderFromProposalUsecase.execute(query, value)
  revalidatePath(`/commercial/proposal/form/update?id=${proposal_id}`)
  revalidatePath(`/commercial/financial/order`)
  return
}

