"use server"

import { IClient } from "@/backend/domain/commercial/entity/client.definition";
import { IProposal } from "@/backend/domain/commercial/entity/proposal.definition";
import { createOneProposalUsecase } from "@/backend/usecase/commercial/proposal/create-one-proposal.usecase";
import { deleteOneProposalUsecase } from "@/backend/usecase/commercial/proposal/delete-one-proposal.usecase";
import { findManyProposalWithClientUsecase } from "@/backend/usecase/commercial/proposal/find-many-proposal-with-client.usecase";
import { updateOneProposalUsecase } from "@/backend/usecase/commercial/proposal/update-one-proposal.usecase";
import { findOneProposalUsecase } from "@/backend/usecase/commercial/proposal/find-one-proposal.usecase";
import { initializeSignatureProcessUscase } from "@/backend/usecase/commercial/proposal/initialize-signature-process.usecase";
import { downloadOneProposalDocumentUsecase } from "@/backend/usecase/commercial/proposal/download-one-proposal-document.usecase";
import { cancelSignatureProcessUscase } from "@/backend/usecase/commercial/proposal/cancel-signature-process.usecase"
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

