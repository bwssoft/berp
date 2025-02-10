"use server"

import { IClient } from "@/app/lib/@backend/domain"
import {
  createOneClientUsecase,
  deleteOneClientUsecase,
  findManyClientUsecase,
  findOneClientUsecase,
  updateOneClientUsecase
} from "@/app/lib/@backend/usecase"
import { Filter } from "mongodb"

export async function createOneClient(client: Omit<IClient, "id" | "created_at">) {
  return await createOneClientUsecase.execute(client)
}

export async function findOneClient(client: Partial<IClient>) {
  return await findOneClientUsecase.execute(client)
}

export async function updateOneClientById(query: { id: string }, value: Omit<IClient, "id" | "created_at">) {
  return await updateOneClientUsecase.execute(query, value)
}

export async function deleteOneClientById(query: { id: string }) {
  return await deleteOneClientUsecase.execute(query)
}

export async function findManyClient(query: Filter<IClient>): Promise<IClient[]> {
  return await findManyClientUsecase.execute(query)
}

