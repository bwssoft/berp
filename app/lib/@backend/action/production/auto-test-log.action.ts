"use server";

import { IAutoTestLog } from "@/app/lib/@backend/domain/production/entity/auto-test-log.definition";
import { createManyAutoTestLogUsecase } from "@/app/lib/@backend/usecase/production/auto-test-log/create-many-auto-test-log.usecase";
import { exportAutoTestLogUsecase } from "@/app/lib/@backend/usecase/production/auto-test-log/export.auto-test-log.usecase";
import { findManyAutoTestLogUsecase } from "@/app/lib/@backend/usecase/production/auto-test-log/find-many-auto-test-log.usecase";
import { findOneAutoTestLogUsecase } from "@/app/lib/@backend/usecase/production/auto-test-log/find-one-auto-test-log.usecase";
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
