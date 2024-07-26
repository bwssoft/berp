"use server"

import { revalidatePath } from "next/cache"
import { IDevice } from "../domain"
import {
  createOneDeviceUsecase,
  findOneDeviceUsecase,
  deleteOneDeviceUsecase,
  updateOneDeviceUsecase,
  findAllDeviceUsecase,
  createManyDeviceUsecase,
  findManyDeviceBySerialUsecase,
} from "../usecase"


export async function createOneDevice(device: Omit<IDevice, "id" | "created_at">) {
  await createOneDeviceUsecase.execute(device)
  revalidatePath("/device/management")
}

export async function createManyDevice(device: (Omit<IDevice, "id" | "created_at">)[]) {
  await createManyDeviceUsecase.execute(device)
  revalidatePath("/device/management")
}

export async function findOneDevice(device: Partial<IDevice>) {
  return await findOneDeviceUsecase.execute(device)
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

export async function findManyDeviceBySerial(serial: string[]): Promise<IDevice[]> {
  return await findManyDeviceBySerialUsecase.execute(serial)
}