"use server"

import { IClient } from "../../definition"
import clientRepository from "../../repository/mongodb/client/client.repository"

const repository = clientRepository

export async function createOneClient(client: Omit<IClient
  , "id" | "created_at">) {
  await repository.create({ ...client, created_at: new Date(), id: crypto.randomUUID() })
  return client
}

export async function findOneClient(client: Partial<IClient>) {
  return await repository.findOne(client)
}

export async function updateOneClientById(query: { id: string }, value: Omit<IClient, "id" | "created_at">) {
  return await repository.updateOne(query, value)
}

export async function deleteOneClientById(query: { id: string }) {
  return await repository.deleteOne(query)
}

export async function findAllClient(): Promise<IClient[]> {
  return await repository.findAll() as IClient[]
}

