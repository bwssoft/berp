"use server";

import { IDeviceIdentificationLog } from "@/app/lib/@backend/domain";
import { createOneDeviceIdentificationLogUsecase } from "@/app/lib/@backend/usecase";

export async function createOneDeviceIdentificationLog(
  input: Omit<IDeviceIdentificationLog, "id" | "created_at" | "user_id">
) {
  const _input = { ...input, user_id: crypto.randomUUID() };
  return await createOneDeviceIdentificationLogUsecase.execute(_input);
}
