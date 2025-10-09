"use server";

import { ISerial } from "@/backend/domain/engineer/entity/serial.definition";
import { findOneSerialUsecase } from "@/backend/usecase/engineer/serial/find-one.serial.usecase";

export async function findOneSerial(input: Partial<ISerial>) {
  return await findOneSerialUsecase.execute(input);
}

