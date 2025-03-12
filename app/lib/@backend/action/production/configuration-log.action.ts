"use server";

import { IConfigurationLog } from "@/app/lib/@backend/domain";
import {
  createManyConfigurationLogUsecase,
  createOneConfigurationLogUsecase,
} from "@/app/lib/@backend/usecase";

export async function createOneConfigurationLog(
  input: Omit<IConfigurationLog, "id" | "created_at" | "user_id">
) {
  await createOneConfigurationLogUsecase.execute({
    ...input,
    user_id: crypto.randomUUID(),
  });
}

export async function createManyConfigurationLog(
  input: Omit<IConfigurationLog, "id" | "created_at" | "user_id">[]
) {
  await createManyConfigurationLogUsecase.execute(
    input.map((i) => ({ ...i, user_id: crypto.randomUUID() }))
  );
}
