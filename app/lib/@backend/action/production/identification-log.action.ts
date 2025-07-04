"use server";

import { IIdentificationLog } from "@/app/lib/@backend/domain";
import {
  createOneIdentificationLogUsecase,
  findManyIdentificationLogUsecase,
  findOneIdentificationLogUsecase,
  exportIdentificationLogUsecase,
} from "@/app/lib/@backend/usecase";
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
