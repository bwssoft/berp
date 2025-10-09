"use server";

import { ISerial } from "@/app/lib/@backend/domain/engineer/entity/serial.definition";
import { findOneSerialUsecase } from "@/app/lib/@backend/usecase/engineer/serial/find-one.serial.usecase";

export async function findOneSerial(input: Partial<ISerial>) {
  return await findOneSerialUsecase.execute(input);
}
