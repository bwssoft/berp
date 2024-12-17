"use server"

import { IClient, IOpportunity } from "@/app/lib/@backend/domain"
import { createOneOpportunityUsecase, deleteOneOpportunityUsecase, findAllOpportunityUsecase, updateOneOpportunityUsecase, findAllOpportunityWithClientUsecase, findOneOpportunityUsecase } from "@/app/lib/@backend/usecase"

export async function createOneClientOpportunity(client: Omit<IOpportunity
  , "id" | "created_at">) {
  return await createOneOpportunityUsecase.execute(client)
}

export async function findOneClientOpportunity(client: Partial<IOpportunity>) {
  return await findOneOpportunityUsecase.execute(client)
}

export async function updateOneClientOpportunityById(query: { id: string }, value: Omit<IOpportunity, "id" | "created_at">) {
  return await updateOneOpportunityUsecase.execute(query, value)
}

export async function deleteOneClientOpportunityById(query: { id: string }) {
  return await deleteOneOpportunityUsecase.execute(query)
}

export async function findAllClientOpportunity(): Promise<IOpportunity[]> {
  return await findAllOpportunityUsecase.execute()
}

export async function findAllClientOpportunityWithClient(): Promise<(IOpportunity & { client: IClient })[]> {
  return await findAllOpportunityWithClientUsecase.execute()
}
