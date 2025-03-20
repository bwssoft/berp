"use server";

import { IConfigurationLog } from "@/app/lib/@backend/domain";
import {
  createManyConfigurationLogUsecase,
  createOneConfigurationLogUsecase,
} from "@/app/lib/@backend/usecase";

export async function createOneConfigurationLog(
  input: Omit<IConfigurationLog, "id" | "created_at" | "user_id">
) {
  const _input = { ...input, user_id: crypto.randomUUID() };
  return await createOneConfigurationLogUsecase.execute(_input);
}

export async function createManyConfigurationLog(
  input: Omit<IConfigurationLog, "id" | "created_at" | "user_id">[]
) {
  const _input = input.map((i) => ({
    ...i,
    user_id: crypto.randomUUID(),
  }));
  return await createManyConfigurationLogUsecase.execute(_input);
}
