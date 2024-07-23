"use server"

import { IInput } from "@/app/lib/@backend/domain"
import { createManyInputUsecase, createOneInputUsecase, deleteOneInputUsecase, findAllInputUsecase, findOneInputUsecase, updateOneInputUsecase } from "../../usecase"
import { revalidatePath } from "next/cache"

export async function createOneInput(input: Omit<IInput
  , "id" | "created_at">) {
  await createOneInputUsecase.execute(input)
  revalidatePath("/input/management")
  return input
}

export async function createManyInput(input: Omit<IInput
  , "id" | "created_at">[]) {
  await createManyInputUsecase.execute(input)
  revalidatePath("/input/management")
  return input
}

export async function findOneInput(input: Partial<IInput>) {
  return await findOneInputUsecase.execute(input)
}

export async function updateOneInputById(query: { id: string }, value: Omit<IInput, "id" | "created_at">) {
  await updateOneInputUsecase.execute(query, value)
  revalidatePath("/input/management")
}

export async function deleteOneInputById(query: { id: string }) {
  await deleteOneInputUsecase.execute(query)
  revalidatePath("/input/management")
}

export async function findAllInput(): Promise<IInput[]> {
  return await findAllInputUsecase.execute()
}

