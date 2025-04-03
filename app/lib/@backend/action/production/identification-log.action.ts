"use server";

import { IIdentificationLog } from "@/app/lib/@backend/domain";
import {
  createOneIdentificationLogUsecase,
  findManyIdentificationLogUsecase,
  findOneIdentificationLogUsecase,
} from "@/app/lib/@backend/usecase";

export async function createOneIdentificationLog(
  input: Omit<IIdentificationLog, "id" | "created_at" | "user">
) {
  const _input = {
    ...input,
    user: {
      id: crypto.randomUUID(),
      name: crypto.randomUUID(),
    },
  };
  return await createOneIdentificationLogUsecase.execute(_input);
}

export async function findOneIdentificationLog(
  input: Partial<IIdentificationLog>
) {
  return await findOneIdentificationLogUsecase.execute(input);
}

export async function findManyIdentificationLog(
  input: Partial<IIdentificationLog>
) {
  return await findManyIdentificationLogUsecase.execute(input);
}
