"use server"

import { IClient, IProposal } from "@/app/lib/@backend/domain"
import { createOneProposalUsecase, deleteOneProposalUsecase, findAllProposalWithClientUsecase, updateOneProposalUsecase, findOneProposalUsecase, createOneProposalDocumentUsecase, initializeSignatureProcessUscase } from "../../usecase"
import { revalidatePath } from "next/cache"
import { deleteOneProposalDocumentUsecase } from "../../usecase/client/proposal/delete-one-proposal-document.usecase"
import { downloadOneProposalDocumentUsecase } from "../../usecase/client/proposal/download-one-proposal-document.usecase"

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

export async function deleteOneProposalDocument(input: { document_key: string, proposal: IProposal }) {
  const { document_key, proposal } = input
  await deleteOneProposalDocumentUsecase.execute({ document_key, proposal })
  revalidatePath(`/sale/proposal/form/update?id=${proposal.id}`)
}

export async function downloadOneProposalDocument(input: { document_key: string, proposal: IProposal }) {
  const { document_key, proposal } = input
  return await downloadOneProposalDocumentUsecase.execute({ document_key, proposal })
}

export async function initializeSignatureProcess(input: { contact_id: string[], document_id: string[], proposal_id: string, scenario_id: string }) {
  await initializeSignatureProcessUscase.execute(input)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}


