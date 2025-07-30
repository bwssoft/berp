"use server";

import { revalidatePath } from "next/cache";
import {
  createOneDeviceUsecase,
  findOneDeviceUsecase,
  deleteOneDeviceUsecase,
  updateOneDeviceUsecase,
  findAllDeviceUsecase,
  createManyDeviceUsecase,
  findManyDeviceBySerialUsecase,
  upsertOneDeviceUsecase,
} from "@/app/lib/@backend/usecase";
import { IDevice, IProduct } from "@/app/lib/@backend/domain";
import { findManyDeviceUsecase } from "../../usecase/engineer/device/find-many-device.usecase";
import { Filter } from "mongodb";

export async function createOneDevice(
  device: Omit<IDevice, "id" | "created_at">
) {
  await createOneDeviceUsecase.execute(device);
  revalidatePath("/engineer/device/management");
  revalidatePath("/engineer/command/schedule");
}

export async function createManyDevice(
  device: Omit<IDevice, "id" | "created_at">[]
) {
  await createManyDeviceUsecase.execute(device);
  revalidatePath("/engineer/device/management");
  revalidatePath("/engineer/command/schedule");
}

export async function findOneDevice(device: Partial<IDevice>) {
  return await findOneDeviceUsecase.execute(device);
}

export async function updateOneDeviceById(
  query: { id: string },
  value: Omit<IDevice, "id" | "created_at">
) {
  await updateOneDeviceUsecase.execute(query, value);
  revalidatePath("/engineer/device/management");
  revalidatePath("/engineer/command/schedule");
}

export async function deleteOneDeviceById(query: { id: string }) {
  await deleteOneDeviceUsecase.execute(query);
  revalidatePath("/engineer/device/management");
  revalidatePath("/engineer/command/schedule");
}

export async function findAllDevice(): Promise<
  (IDevice & {
    product: IProduct;
  })[]
> {
  return await findAllDeviceUsecase.execute();
}

export async function findManyDevice(input: Filter<IDevice>) {
  return await findManyDeviceUsecase.execute(input);
}

export async function findManyDeviceBySerial(
  serial: string[]
): Promise<IDevice[]> {
  return await findManyDeviceBySerialUsecase.execute(serial);
}

export async function upsertOneDevice(
  query: { id?: string; "equipment.serial"?: string },
  value: Omit<IDevice, "id" | "created_at">
) {
  await upsertOneDeviceUsecase.execute(query, value);
  revalidatePath("/engineer/device/management");
}
