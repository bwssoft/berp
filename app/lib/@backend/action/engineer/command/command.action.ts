"use server"

import { revalidatePath } from "next/cache"
import { ICommand } from "@/app/lib/@backend/domain/engineer/entity/command.definition";
import { createOneCommandUsecase } from "@/app/lib/@backend/usecase/engineer/command/command/create-one-command.usecase";
import { findOneCommandUsecase } from "@/app/lib/@backend/usecase/engineer/command/command/find-one-command.usecase";
import { deleteOneCommandUsecase } from "@/app/lib/@backend/usecase/engineer/command/command/delete-one-command.usecase";
import { updateOneCommandUsecase } from "@/app/lib/@backend/usecase/engineer/command/command/update-one-command.usecase";
import { findAllCommandUsecase } from "@/app/lib/@backend/usecase/engineer/command/command/find-all-command.usecase"

export async function createOneCommand(command: Omit<ICommand, "id" | "created_at">) {
  await createOneCommandUsecase.execute(command)
  revalidatePath('/engineer/command')
}

export async function findOneCommand(command: Partial<ICommand>) {
  return await findOneCommandUsecase.execute(command)
}

export async function updateOneCommandById(
  query: { id: string },
  value: Omit<ICommand, "id" | "created_at">,
) {
  await updateOneCommandUsecase.execute(query, value)
  revalidatePath('/engineer/command')
}

export async function deleteOneCommandById(query: { id: string }) {
  await deleteOneCommandUsecase.execute(query)
  revalidatePath('/engineer/command')
}

export async function findAllCommand(): Promise<ICommand[]> {
  return await findAllCommandUsecase.execute()
}


