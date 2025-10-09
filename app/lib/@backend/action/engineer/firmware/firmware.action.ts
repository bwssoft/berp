"use server"

import { revalidatePath } from "next/cache"
import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import { createOneFirmwareUsecase } from "@/backend/usecase/engineer/firmware/firmware/create-one-firmware.usecase";
import { findOneFirmwareUsecase } from "@/backend/usecase/engineer/firmware/firmware/find-one-firmware.usecase";
import { deleteOneFirmwareUsecase } from "@/backend/usecase/engineer/firmware/firmware/delete-one-firmware.usecase";
import { updateOneFirmwareUsecase } from "@/backend/usecase/engineer/firmware/firmware/update-one-firmware.usecase";
import { findAllFirmwareUsecase } from "@/backend/usecase/engineer/firmware/firmware/find-all-firmware.usecase"

type FirmwareWithoutFile = Omit<IFirmware, "id" | "created_at" | "file">
export async function createOneFirmware(firmware: FirmwareWithoutFile, formData: FormData) {
  const file = formData.get("file") as File
  await createOneFirmwareUsecase.execute(firmware, file)
  revalidatePath('/engineer/firmware/management')
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
  revalidatePath('/engineer/firmware/management')
}

export async function deleteOneFirmwareById(query: { id: string }) {
  await deleteOneFirmwareUsecase.execute(query)
  revalidatePath('/engineer/firmware/management')
}

export async function findAllFirmware(): Promise<IFirmware[]> {
  return await findAllFirmwareUsecase.execute()
}



