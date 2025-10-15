"use server";

import { IIdentificationLog } from "@/backend/domain/production/entity/identification-log.definition";
import { createOneIdentificationLogUsecase } from "@/backend/usecase/production/identification-log/create-one-identification-log.usecase";
import { findManyIdentificationLogUsecase } from "@/backend/usecase/production/identification-log/find-many-identification-log.usecase";
import { findOneIdentificationLogUsecase } from "@/backend/usecase/production/identification-log/find-one-identification-log.usecase";
import { exportIdentificationLogUsecase } from "@/backend/usecase/production/identification-log/export.identification-log.usecase";
import { auth } from "@/auth";
import { Filter } from "mongodb";

export async function createOneIdentificationLog(
  input: Omit<IIdentificationLog, "id" | "created_at" | "user">
) {
  const session = await auth();
  if (!session) return;

  const _input = {
    ...input,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
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
  input: Filter<IIdentificationLog>
) {
  return await findManyIdentificationLogUsecase.execute(input);
}

export async function exportIdentificationLog(
  input: Filter<IIdentificationLog>
) {
  return await exportIdentificationLogUsecase.execute(input);
}

