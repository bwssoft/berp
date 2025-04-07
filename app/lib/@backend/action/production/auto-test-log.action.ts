"use server";

import { IAutoTestLog } from "@/app/lib/@backend/domain";
import {
  createManyAutoTestLogUsecase,
  exportAutoTestLogUsecase,
  findManyAutoTestLogUsecase,
  findOneAutoTestLogUsecase,
} from "@/app/lib/@backend/usecase";
import { Filter } from "mongodb";

export async function createManyAutoTestLog(
  input: Omit<IAutoTestLog, "id" | "created_at" | "user">[]
) {
  const _input = input.map((i) => ({
    ...i,
    user: {
      id: crypto.randomUUID(),
      name: crypto.randomUUID(),
    },
  }));
  return await createManyAutoTestLogUsecase.execute(_input);
}

export async function findOneAutoTestLog(input: Partial<IAutoTestLog>) {
  return await findOneAutoTestLogUsecase.execute(input);
}

export async function findManyAutoTestLog(input: Filter<IAutoTestLog>) {
  return await findManyAutoTestLogUsecase.execute(input);
}

export async function exportAutoTestLog(input: Filter<IAutoTestLog>) {
  return await exportAutoTestLogUsecase.execute(input);
}
