"use server"

import { IProposal } from "@/app/lib/@backend/domain"
import { createOneProposalUsecase, deleteOneProposalUsecase, findAllProposalUsecase, updateOneProposalUsecase, findOneProposalUsecase } from "../../usecase"

export async function createOneClientProposal(client: Omit<IProposal
  , "id" | "created_at" | "user_id">) {
  return await createOneProposalUsecase.execute(client)
}

export async function findOneClientProposal(client: Partial<IProposal>) {
  return await findOneProposalUsecase.execute(client)
}

export async function updateOneClientProposalById(query: { id: string }, value: Omit<IProposal, "id" | "created_at">) {
  return await updateOneProposalUsecase.execute(query, value)
}

export async function deleteOneClientProposalById(query: { id: string }) {
  return await deleteOneProposalUsecase.execute(query)
}

export async function findAllClientProposal(): Promise<IProposal[]> {
  return await findAllProposalUsecase.execute()
}
