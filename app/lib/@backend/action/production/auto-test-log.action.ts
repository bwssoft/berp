"use server";

import { IAutoTestLog } from "@/app/lib/@backend/domain";
import {
  createManyAutoTestLogUsecase,
  findOneAutoTestLogUsecase,
} from "@/app/lib/@backend/usecase";

export async function createManyAutoTestLog(
  input: Omit<IAutoTestLog, "id" | "created_at" | "user_id">[]
) {
  const _input = input.map((i) => ({
    ...i,
    user_id: crypto.randomUUID(),
  }));
  return await createManyAutoTestLogUsecase.execute(_input);
}

export async function findOneAutoTestLog(input: Partial<IAutoTestLog>) {
  return await findOneAutoTestLogUsecase.execute(input);
}
