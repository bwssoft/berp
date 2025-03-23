"use server";

import { IDeviceIdentificationLog } from "@/app/lib/@backend/domain";
import {
  createOneDeviceIdentificationLogUsecase,
  findManyDeviceIdentificationLogUsecase,
  findOneDeviceIdentificationLogUsecase,
} from "@/app/lib/@backend/usecase";

export async function createOneDeviceIdentificationLog(
  input: Omit<IDeviceIdentificationLog, "id" | "created_at" | "user">
) {
  const _input = {
    ...input,
    user: {
      id: crypto.randomUUID(),
      name: crypto.randomUUID(),
    },
  };
  return await createOneDeviceIdentificationLogUsecase.execute(_input);
}

export async function findOneDeviceIdentificationLog(
  input: Partial<IDeviceIdentificationLog>
) {
  return await findOneDeviceIdentificationLogUsecase.execute(input);
}

export async function findManyDeviceIdentificationLog(
  input: Partial<IDeviceIdentificationLog>
) {
  return await findManyDeviceIdentificationLogUsecase.execute(input);
}
