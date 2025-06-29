"use server";

import { IConfigurationLog } from "@/app/lib/@backend/domain";
import {
  createManyConfigurationLogUsecase,
  createOneConfigurationLogUsecase,
  findManyConfigurationLogUsecase,
  findOneConfigurationLogUsecase,
  exportConfigurationLogUsecase,
} from "@/app/lib/@backend/usecase";
import { auth } from "@/auth";
import { Filter } from "mongodb";
import { statsConfigurationLogUsecase } from "../../usecase/production/configuration-log/stats-configuration-log.usecase";

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
  const session = await auth();
  if (!session) throw Error("Not authenticated");

  const _input = input.map((i) => ({
    ...i,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
  }));
  return await createManyConfigurationLogUsecase.execute(_input);
}

export async function findOneConfigurationLog(
  input: Partial<IConfigurationLog>
) {
  return await findOneConfigurationLogUsecase.execute(input);
}

export async function findManyConfigurationLog(
  input: Filter<IConfigurationLog>
) {
  return await findManyConfigurationLogUsecase.execute(input);
}

export async function exportConfigurationLog(input: Filter<IConfigurationLog>) {
  return await exportConfigurationLogUsecase.execute(input);
}

export async function statsConfigurationLog() {
  return await statsConfigurationLogUsecase.execute();
}
