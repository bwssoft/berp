"use server";

import { IFirmwareUpdateLog } from "@/app/lib/@backend/domain";
import { auth } from "@/auth";
import { Filter } from "mongodb";
import { createOneFirmwareUpdateLogUsecase } from "../../usecase/production/firmware-update-log/create-one-firmware-update-log.usecase";
import { createManyFirmwareUpdateLogUsecase } from "../../usecase/production/firmware-update-log/create-many-firmware-update-log.usecase";
import { findOneFirmwareUpdateLogUsecase } from "../../usecase/production/firmware-update-log/find-one-firmware-update-log.usecase";
import { findManyFirmwareUpdateLogUsecase } from "../../usecase/production/firmware-update-log/find-many-firmware-update-log.usecase";
import { exportFirmwareUpdateLogUsecase } from "../../usecase/production/firmware-update-log/export.firmware-update-log.usecase";
import { statsFirmwareUpdateLogUsecase } from "../../usecase/production/firmware-update-log/stats-firmware-update-log.usecase";
import { updateBulkFirmwareUpdateLogUsecase } from "../../usecase/production/firmware-update-log/update-bulk.firmware-update-log.usecase";

export async function createOneFirmwareUpdateLog(
  input: Omit<IFirmwareUpdateLog, "id" | "created_at" | "user">
) {
  const _input = {
    ...input,
    user: {
      id: crypto.randomUUID(),
      name: crypto.randomUUID(),
    },
  };
  return await createOneFirmwareUpdateLogUsecase.execute(_input);
}

export async function createManyFirmwareUpdateLog(
  input: Omit<IFirmwareUpdateLog, "id" | "created_at" | "user">[]
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
  return await createManyFirmwareUpdateLogUsecase.execute(_input);
}

export async function findOneFirmwareUpdateLog(
  input: Partial<IFirmwareUpdateLog>
) {
  return await findOneFirmwareUpdateLogUsecase.execute(input);
}

export async function findManyFirmwareUpdateLog(
  input: Filter<IFirmwareUpdateLog>
) {
  return await findManyFirmwareUpdateLogUsecase.execute(input);
}

export async function exportFirmwareUpdateLog(
  input: Filter<IFirmwareUpdateLog>
) {
  return await exportFirmwareUpdateLogUsecase.execute(input);
}

export async function statsFirmwareUpdateLog() {
  return await statsFirmwareUpdateLogUsecase.execute();
}

export async function updateBulkFirmwareUpdateLog(
  operations: {
    query: { id: string };
    value: Partial<IFirmwareUpdateLog>;
  }[]
) {
  await updateBulkFirmwareUpdateLogUsecase.execute(operations);
}
