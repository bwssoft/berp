"use server"

import { IInput } from "../../definition"
import inputRepository from "../../repository/mongodb/input/input.repository"

const repository = inputRepository

export async function createOneInput(input: Omit<IInput
  , "id" | "created_at">) {
  await repository.create({ ...input, created_at: new Date(), id: crypto.randomUUID() })
  return input
}

export async function findOneInput(input: Partial<IInput>) {
  return await repository.findOne(input)
}

export async function updateOneInputById(query: { id: string }, value: Omit<IInput, "id" | "created_at">) {
  return await repository.updateOne(query, value)
}

export async function deleteOneInputById(query: { id: string }) {
  return await repository.deleteOne(query)
}

export async function findAllInput(): Promise<IInput[]> {
  return await repository.findAll() as IInput[]
}

