"use server"

import { IInput } from "@/app/lib/@backend/domain"
import { createManyInputUsecase, createOneInputUsecase, deleteOneInputUsecase, findAllInputUsecase, findOneInputUsecase, updateOneInputUsecase } from "../../usecase/input"

export async function createOneInput(input: Omit<IInput
  , "id" | "created_at">) {
  await createOneInputUsecase.execute(input)
  return input
}

export async function createManyInput(input: Omit<IInput
  , "id" | "created_at">[]) {
  await createManyInputUsecase.execute(input)
  return input
}

export async function findOneInput(input: Partial<IInput>) {
  return await findOneInputUsecase.execute(input)
}

export async function updateOneInputById(query: { id: string }, value: Omit<IInput, "id" | "created_at">) {
  return await updateOneInputUsecase.execute(query, value)
}

export async function deleteOneInputById(query: { id: string }) {
  return await deleteOneInputUsecase.execute(query)
}

export async function findAllInput(): Promise<IInput[]> {
  return await findAllInputUsecase.execute()
}

