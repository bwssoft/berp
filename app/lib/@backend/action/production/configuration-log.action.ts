"use server";

import { IConfigurationLog } from "@/app/lib/@backend/domain";
import {
  createManyConfigurationLogUsecase,
  createOneConfigurationLogUsecase,
  findOneConfigurationLogUsecase,
} from "@/app/lib/@backend/usecase";

export async function createOneConfigurationLog(
  input: Omit<IConfigurationLog, "id" | "created_at" | "user">
) {
  const _input = {
    ...input,
    user: {
      id: crypto.randomUUID(),
      name: crypto.randomUUID(),
    },
  };
  return await createOneConfigurationLogUsecase.execute(_input);
}

export async function createManyConfigurationLog(
  input: Omit<IConfigurationLog, "id" | "created_at" | "user">[]
) {
  const _input = input.map((i) => ({
    ...i,
    user: {
      id: crypto.randomUUID(),
      name: crypto.randomUUID(),
    },
  }));
  return await createManyConfigurationLogUsecase.execute(_input);
}

export async function findOneConfigurationLog(
  input: Partial<IConfigurationLog>
) {
  return await findOneConfigurationLogUsecase.execute(input);
}
