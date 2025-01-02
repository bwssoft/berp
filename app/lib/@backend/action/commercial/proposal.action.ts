"use server"

import { IClient, IProposal } from "@/app/lib/@backend/domain"
import {
  createOneProposalUsecase, deleteOneProposalUsecase, findManyProposalWithClientUsecase, updateOneProposalUsecase, findOneProposalUsecase, initializeSignatureProcessUscase,
  downloadOneProposalDocumentUsecase,
  cancelSignatureProcessUscase,
} from "@/app/lib/@backend/usecase"
import { revalidatePath } from "next/cache"

export async function createOneProposal(client: Omit<IProposal
  , "id" | "created_at" | "user_id" | "code">) {
  await createOneProposalUsecase.execute(client)
  revalidatePath("/commercial/proposal")
  return
}

export async function findOneProposal(client: Partial<IProposal>) {
  return await findOneProposalUsecase.execute(client)
}

export async function updateOneProposalById(query: { id: string }, value: Omit<IProposal, "id" | "created_at" | "user_id" | "code">) {
  await updateOneProposalUsecase.execute(query, value)
  revalidatePath("/commercial/proposal")
  return
}

export async function deleteOneProposalById(query: { id: string }) {
  await deleteOneProposalUsecase.execute(query)
  revalidatePath("/commercial/proposal")
  return
}

export async function findManyProposal(input: Partial<IProposal>): Promise<(IProposal & { client: IClient })[]> {
  return await findManyProposalWithClientUsecase.execute(input)
}

export async function downloadOneProposalDocument(input: {
  document: NonNullable<IProposal["scenarios"][number]["signature_process"]>["documents"][number]
}) {
  const { document } = input
  return await downloadOneProposalDocumentUsecase.execute({ document })
}

export async function initializeSignatureProcess(input: { proposal_id: string, scenario_id: string }) {
  await initializeSignatureProcessUscase.execute(input)
  revalidatePath(`/commercial/proposal/form/update?id=${input.proposal_id}`)
}

export async function cancelSignatureProcess(input: { proposal_id: string, scenario_id: string }) {
  await cancelSignatureProcessUscase.execute(input)
  revalidatePath(`/commercial/proposal/form/update?id=${input.proposal_id}`)
}
