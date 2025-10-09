"use server"

import { revalidatePath } from "next/cache"
import { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import { ICommand } from "@/backend/domain/engineer/entity/command.definition";
import { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import { createOneScheduleUsecase } from "@/backend/usecase/engineer/command/schedule/create-one-schedule.usecase";
import { findOneScheduleUsecase } from "@/backend/usecase/engineer/command/schedule/find-one-schedule.usecase";
import { deleteOneScheduleUsecase } from "@/backend/usecase/engineer/command/schedule/delete-one-schedule.usecase";
import { updateOneScheduleUsecase } from "@/backend/usecase/engineer/command/schedule/update-one-schedule.usecase";
import { findAllScheduleUsecase } from "@/backend/usecase/engineer/command/schedule/find-all-schedule.usecase";
import { createManyScheduleUsecase } from "@/backend/usecase/engineer/command/schedule/create-many-schedule.usecase";
import { findManyPendingScheduleBySerialUsecase } from "@/backend/usecase/engineer/command/schedule/find-many-pending-schedule-by-serial.usecase";
import { updateManyScheduleUsecase } from "@/backend/usecase/engineer/command/schedule/update-many-schedule.usecase";
import { updateBulkScheduleUsecase } from "@/backend/usecase/engineer/command/schedule/update-bulk-schedule.usecase"

export async function createOneSchedule(schedule: Omit<ISchedule, "id" | "created_at">) {
  await createOneScheduleUsecase.execute(schedule)
  revalidatePath('/engineer/command/schedule')
}

export async function createManySchedule(schedule: (Omit<ISchedule, "id" | "created_at">)[]) {
  await createManyScheduleUsecase.execute(schedule)
  revalidatePath('/engineer/command/schedule')
}

export async function findOneSchedule(schedule: Partial<ISchedule>) {
  return await findOneScheduleUsecase.execute(schedule)
}

export async function updateOneScheduleById(
  query: { id: string },
  value: Omit<ISchedule, "id" | "created_at">,
) {
  await updateOneScheduleUsecase.execute(query, value)
  revalidatePath('/engineer/command/schedule')
}

export async function updateManyScheduleById(
  query: { id: string[] },
  value: Omit<ISchedule, "id" | "created_at">,
) {
  await updateManyScheduleUsecase.execute(query, value)
  revalidatePath('/engineer/command/schedule')
}

export async function updateBulkSchedule(operations: {
  query: { id: string },
  value: Omit<ISchedule, "id" | "created_at">,
}[]) {
  await updateBulkScheduleUsecase.execute(operations)
  revalidatePath('/engineer/command/schedule')
}

export async function deleteOneScheduleById(query: { id: string }) {
  await deleteOneScheduleUsecase.execute(query)
  revalidatePath('/engineer/command/schedule')
}

export async function findAllSchedule(): Promise<(ISchedule & { device: IDevice, command: ICommand, firmware?: IFirmware })[]> {
  return await findAllScheduleUsecase.execute()
}

export async function findManyPendingScheduleBySerial(serial: string): Promise<(ISchedule & { device: IDevice, command: ICommand, firmware?: IFirmware })[]> {
  return await findManyPendingScheduleBySerialUsecase.execute(serial)
}





