"use server"

import { IClient, IClientOpportunity } from "../../domain"
import { clientOpportunityRepository } from "../../repository/mongodb"



const repository = clientOpportunityRepository

export async function createOneClientOpportunity(client: Omit<IClientOpportunity
  , "id" | "created_at">) {
  await repository.create({ ...client, created_at: new Date(), id: crypto.randomUUID() })
  return client
}

export async function findOneClientOpportunity(client: Partial<IClientOpportunity>) {
  return await repository.findOne(client)
}

export async function updateOneClientOpportunityById(query: { id: string }, value: Omit<IClientOpportunity, "id" | "created_at">) {
  return await repository.updateOne(query, value)
}

export async function deleteOneClientOpportunityById(query: { id: string }) {
  return await repository.deleteOne(query)
}

export async function findAllClientOpportunity(): Promise<IClientOpportunity[]> {
  return await repository.findAll() as IClientOpportunity[]
}

export async function findAllClientOpportunityWithClient(): Promise<(IClientOpportunity & { client: IClient })[]> {
  return await repository.findAllWithClient() as (IClientOpportunity & { client: IClient })[]
}
