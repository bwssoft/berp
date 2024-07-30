"use server"

import { revalidatePath } from "next/cache"
import { IFirmware } from "../../domain"
import {
  createOneFirmwareUsecase,
  findOneFirmwareUsecase,
  deleteOneFirmwareUsecase,
  updateOneFirmwareUsecase,
  findAllFirmwareUsecase
} from "../../usecase"

type FirmwareWithoutFile = Omit<IFirmware, "id" | "created_at" | "file">
export async function createOneFirmware(firmware: FirmwareWithoutFile, formData: FormData) {
  const file = formData.get("file") as File
  await createOneFirmwareUsecase.execute(firmware, file)
  revalidatePath('/firmware/management')
}

export async function findOneFirmware(firmware: Partial<IFirmware>) {
  return await findOneFirmwareUsecase.execute(firmware)
}

export async function updateOneFirmwareById(
  query: { id: string },
  value: Omit<IFirmware, "id" | "created_at">,
  formData?: FormData
) {
  const file = formData?.get("file") as File | undefined
  await updateOneFirmwareUsecase.execute(query, value, file)
  revalidatePath('/firmware/management')
}

export async function deleteOneFirmwareById(query: { id: string }) {
  await deleteOneFirmwareUsecase.execute(query)
  revalidatePath('/firmware/management')
}

export async function findAllFirmware(): Promise<IFirmware[]> {
  return await findAllFirmwareUsecase.execute()
}


