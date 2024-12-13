"use server"

import { IClient, IProposal } from "@/app/lib/@backend/domain"
import {
  createOneProposalUsecase, deleteOneProposalUsecase, findAllProposalWithClientUsecase, updateOneProposalUsecase, findOneProposalUsecase, createOneProposalDocumentUsecase, initializeSignatureProcessUscase, deleteOneProposalDocumentUsecase,
  downloadOneProposalDocumentUsecase,
  cancelSignatureProcessUscase,
} from "../../usecase"
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

export async function createOneProposalDocument(input: { scenario: IProposal["scenarios"][number], proposal: IProposal }) {
  const { scenario, proposal } = input
  await createOneProposalDocumentUsecase.execute({ scenario, proposal })
  revalidatePath(`/sale/proposal/form/update?id=${proposal.id}`)
}

export async function deleteOneProposalDocument(input: {
  proposal_id: string;
  scenario_id: string;
  document: NonNullable<IProposal["scenarios"][number]["document"]>[number]
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
  document: NonNullable<IProposal["scenarios"][number]["document"]>[number]
}) {
  const { document } = input
  return await downloadOneProposalDocumentUsecase.execute({ document })
}

export async function initializeSignatureProcess(input: { proposal_id: string, scenario_id: string }) {
  await initializeSignatureProcessUscase.execute(input)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}

export async function cancelSignatureProcess(input: { proposal_id: string, scenario_id: string }) {
  await cancelSignatureProcessUscase.execute(input)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
}
