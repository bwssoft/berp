"use server"

import { revalidatePath } from "next/cache"
import { IFirmware } from "../domain"
import {
  createOneFirmwareUsecase,
  findOneFirmwareUsecase,
  deleteOneFirmwareUsecase,
  updateOneFirmwareUsecase,
  findAllFirmwareUsecase
} from "../usecase"


export async function createOneFirmware(productionOrder: Omit<IFirmware, "id" | "created_at">) {
  await createOneFirmwareUsecase.execute(productionOrder)
  revalidatePath('/firmware/management')
}

export async function findOneFirmware(productionOrder: Partial<IFirmware>) {
  return await findOneFirmwareUsecase.execute(productionOrder)
}

export async function updateOneFirmwareById(query: { id: string }, value: Omit<IFirmware, "id" | "created_at">) {
  await updateOneFirmwareUsecase.execute(query, value)
  revalidatePath('/firmware/management')
}

export async function deleteOneFirmwareById(query: { id: string }) {
  await deleteOneFirmwareUsecase.execute(query)
  revalidatePath('/firmware/management')
}

export async function findAllFirmware(): Promise<IFirmware[]> {
  return await findAllFirmwareUsecase.execute()
}


