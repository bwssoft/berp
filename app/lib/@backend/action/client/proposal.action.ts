"use server"

import { IClient, IProposal } from "@/app/lib/@backend/domain"
import { createOneProposalUsecase, deleteOneProposalUsecase, findAllProposalWithClientUsecase, updateOneProposalUsecase, findOneProposalUsecase, createOneProposalDocumentUsecase } from "../../usecase"
import { revalidatePath } from "next/cache"

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

export async function createOneProposalDocument(input: { scenario_id: string, proposal: IProposal }) {
  const { scenario_id, proposal } = input
  await createOneProposalDocumentUsecase.execute({ scenario_id, proposal })
  revalidatePath(`/sale/proposal/form/update?id=${proposal.id}`)
}
