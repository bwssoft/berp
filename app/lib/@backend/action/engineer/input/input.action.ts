"use server"

import { IInput } from "@/app/lib/@backend/domain"
import { createManyInputUsecase, createOneInputUsecase, deleteOneInputUsecase, findManyInputUsecase, findOneInputUsecase, updateOneInputUsecase } from "@/app/lib/@backend/usecase"
import { revalidatePath } from "next/cache"

export async function createOneInput(input: Omit<IInput
  , "id" | "created_at" | "code">) {
  await createOneInputUsecase.execute(input)
  revalidatePath("/input")
  revalidatePath('/product')
  return input
}

export async function createManyInput(input: Omit<IInput
  , "id" | "created_at" | "code">[]) {
  await createManyInputUsecase.execute(input)
  revalidatePath("/input")
  revalidatePath('/product')
  return input
}

export async function findOneInput(input: Partial<IInput>) {
  return await findOneInputUsecase.execute(input)
}

export async function updateOneInputById(query: { id: string }, value: Omit<IInput, "id" | "created_at" | "code">) {
  await updateOneInputUsecase.execute(query, value)
  revalidatePath("/input")
  revalidatePath('/product')
}

export async function deleteOneInputById(query: { id: string }) {
  await deleteOneInputUsecase.execute(query)
  revalidatePath("/input")
  revalidatePath('/product')
}

export async function findManyInput(input: Partial<IInput>): Promise<IInput[]> {
  return await findManyInputUsecase.execute(input)
}

