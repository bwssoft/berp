"use server"

import { IClient, IProposal } from "@/app/lib/@backend/domain"
import { createOneProposalUsecase, deleteOneProposalUsecase, findAllProposalWithClientUsecase, updateOneProposalUsecase, findOneProposalUsecase, createOneProposalDocumentUsecase, initializeSignatureProcessUscase } from "../../usecase"
import { revalidatePath } from "next/cache"
import { deleteOneProposalDocumentUsecase } from "../../usecase/client/proposal/delete-one-proposal-document.usecase"
import { downloadOneProposalDocumentUsecase } from "../../usecase/client/proposal/download-one-proposal-document.usecase"
import { cancelSignatureProcessUscase } from "../../usecase/client/proposal/cancel-signature-process.usecase"
import { initializeBillingProcessUscase } from "../../usecase/client/proposal/initialize-billing-process.usecase"
import { cancelBillingProcessUscase } from "../../usecase/client/proposal/cancel-billing-process.usecase"

export async function createOneClientProposal(client: Omit<IProposal
  , "id" | "created_at" | "user_id">) {
  await createOneProposalUsecase.execute(client)
  revalidatePath("/sale/proposal")
  return
}

export async function findOneClientProposal(client: Partial<IProposal>) {
  return await findOneProposalUsecase.execute(client)
}

export async function updateOneClientProposalById(query: { id: string }, value: Omit<IProposal, "id" | "created_at" | "user_id">) {
  await updateOneProposalUsecase.execute(query, value)
  revalidatePath("/sale/proposal")
  return
}

export async function deleteOneClientProposalById(query: { id: string }) {
  await deleteOneProposalUsecase.execute(query)
  revalidatePath("/sale/proposal")
  return
}

export async function findAllClientProposal(): Promise<(IProposal & { client: IClient })[]> {
  return await findAllProposalWithClientUsecase.execute()
}

export async function createOneProposalDocument(input: { scenario: IProposal["scenarios"][number], proposal: IProposal }) {
  const { scenario, proposal } = input
  await createOneProposalDocumentUsecase.execute({ scenario, proposal })
  revalidatePath(`/sale/proposal/form/update?id=${proposal.id}`)
}

export async function deleteOneProposalDocument(input: {
  proposal_id: string;
  scenario_id: string;
  document: NonNullable<IProposal["document"]>[string][number]
}) {
  const {
    proposal_id,
    scenario_id,
    document,
  } = input
  await deleteOneProposalDocumentUsecase.execute({
    proposal_id,
    scenario_id,
    document,
  })
  revalidatePath(`/sale/proposal/form/update?id=${proposal_id}`)
}

export async function downloadOneProposalDocument(input: {
  document: NonNullable<IProposal["document"]>[string][number]
}) {
  const { document } = input
  return await downloadOneProposalDocumentUsecase.execute({ document })
}

export async function initializeSignatureProcess(input: { document_id: string[], proposal_id: string, scenario_id: string }) {
  await initializeSignatureProcessUscase.execute(input)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}

export async function cancelSignatureProcess(input: { proposal_id: string, scenario_id: string }) {
  await cancelSignatureProcessUscase.execute(input)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}


export async function initializeBillingProcess(input: { scenario: IProposal["scenarios"][number], proposal_id: string }) {
  await initializeBillingProcessUscase.execute(input)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}

export async function cancelBillingProcess(input: { proposal_id: string, scenario_id: string }) {
  await cancelBillingProcessUscase.execute(input)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}


