"use server"

import { revalidatePath } from "next/cache"
import {
  createOneDeviceUsecase,
  findOneDeviceUsecase,
  deleteOneDeviceUsecase,
  updateOneDeviceUsecase,
  findAllDeviceUsecase,
  createManyDeviceUsecase,
  findManyDeviceBySerialUsecase,
} from "@/app/lib/@backend/usecase"
import { IDevice, IProduct } from "@/app/lib/@backend/domain"


export async function createOneDevice(device: Omit<IDevice, "id" | "created_at">) {
  await createOneDeviceUsecase.execute(device)
  revalidatePath("/engineer/device/management")
  revalidatePath('/engineer/command/schedule')
}

export async function createManyDevice(device: (Omit<IDevice, "id" | "created_at">)[]) {
  await createManyDeviceUsecase.execute(device)
  revalidatePath("/engineer/device/management")
  revalidatePath('/engineer/command/schedule')
}

export async function findOneDevice(device: Partial<IDevice>) {
  return await findOneDeviceUsecase.execute(device)
}

export async function updateOneDeviceById(query: { id: string }, value: Omit<IDevice, "id" | "created_at">) {
  await updateOneDeviceUsecase.execute(query, value)
  revalidatePath("/engineer/device/management")
  revalidatePath('/engineer/command/schedule')
}

export async function deleteOneDeviceById(query: { id: string }) {
  await deleteOneDeviceUsecase.execute(query)
  revalidatePath("/engineer/device/management")
  revalidatePath('/engineer/command/schedule')
}

export async function findAllDevice(): Promise<(IDevice & {
  product: IProduct;
})[]> {
  return await findAllDeviceUsecase.execute()
}

export async function findManyDeviceBySerial(serial: string[]): Promise<IDevice[]> {
  return await findManyDeviceBySerialUsecase.execute(serial)
}