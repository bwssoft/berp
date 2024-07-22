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

type FirmwareToCreate = Omit<IFirmware, "id" | "created_at" | "file">
export async function createOneFirmware(firmware: FirmwareToCreate, formData: FormData) {
  const file = formData.get("file") as File
  await createOneFirmwareUsecase.execute(firmware, file)
  revalidatePath('/firmware/management')
}

export async function findOneFirmware(firmware: Partial<IFirmware>) {
  return await findOneFirmwareUsecase.execute(firmware)
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


