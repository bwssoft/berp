"use server";

import { ISerial } from "@/app/lib/@backend/domain";
import { findOneSerialUsecase } from "@/app/lib/@backend/usecase";

export async function findOneSerial(input: Partial<ISerial>) {
  return await findOneSerialUsecase.execute(input);
}
