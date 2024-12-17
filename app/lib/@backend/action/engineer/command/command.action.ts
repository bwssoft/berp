"use server"

import { revalidatePath } from "next/cache"
import { ICommand } from "@/app/lib/@backend/domain"
import {
  createOneCommandUsecase,
  findOneCommandUsecase,
  deleteOneCommandUsecase,
  updateOneCommandUsecase,
  findAllCommandUsecase
} from "@/app/lib/@backend/usecase"

export async function createOneCommand(command: Omit<ICommand, "id" | "created_at">) {
  await createOneCommandUsecase.execute(command)
  revalidatePath('/command')
}

export async function findOneCommand(command: Partial<ICommand>) {
  return await findOneCommandUsecase.execute(command)
}

export async function updateOneCommandById(
  query: { id: string },
  value: Omit<ICommand, "id" | "created_at">,
) {
  await updateOneCommandUsecase.execute(query, value)
  revalidatePath('/command')
}

export async function deleteOneCommandById(query: { id: string }) {
  await deleteOneCommandUsecase.execute(query)
  revalidatePath('/command')
}

export async function findAllCommand(): Promise<ICommand[]> {
  return await findAllCommandUsecase.execute()
}


