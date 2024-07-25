"use server"

import { revalidatePath } from "next/cache"
import { IDevice } from "../domain"
import {
  createOneDeviceUsecase,
  findOneDeviceUsecase,
  deleteOneDeviceUsecase,
  updateOneDeviceUsecase,
  findAllDeviceUsecase,
} from "../usecase"


export async function createOneDevice(productionOrder: Omit<IDevice, "id" | "created_at">) {
  await createOneDeviceUsecase.execute(productionOrder)
  revalidatePath("/device/management")
}

export async function findOneDevice(productionOrder: Partial<IDevice>) {
  return await findOneDeviceUsecase.execute(productionOrder)
}

export async function updateOneDeviceById(query: { id: string }, value: Omit<IDevice, "id" | "created_at">) {
  await updateOneDeviceUsecase.execute(query, value)
  revalidatePath("/device/management")
}

export async function deleteOneDeviceById(query: { id: string }) {
  await deleteOneDeviceUsecase.execute(query)
  revalidatePath("/device/management")
}

export async function findAllDevice(): Promise<IDevice[]> {
  return await findAllDeviceUsecase.execute()
}
