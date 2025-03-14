"use server";

import { IAutoTestLog } from "@/app/lib/@backend/domain";
import { createManyAutoTestLogUsecase } from "@/app/lib/@backend/usecase";

export async function createManyAutoTestLog(
  input: Omit<IAutoTestLog, "id" | "created_at" | "user_id">[]
) {
  const _input = input.map((i) => ({
    ...i,
    created_at: new Date(),
    id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
  }));
  await createManyAutoTestLogUsecase.execute(_input);
  return _input;
}
