"use server"

import { revalidatePath } from "next/cache"
import { ICommand, IDevice, IFirmware, ISchedule } from "@/app/lib/@backend/domain"
import {
  createOneScheduleUsecase,
  findOneScheduleUsecase,
  deleteOneScheduleUsecase,
  updateOneScheduleUsecase,
  findAllScheduleUsecase,
  createManyScheduleUsecase,
  findManyPendingScheduleBySerialUsecase,
  updateManyScheduleUsecase,
  updateBulkScheduleUsecase
} from "@/app/lib/@backend/usecase"

export async function createOneSchedule(schedule: Omit<ISchedule, "id" | "created_at">) {
  await createOneScheduleUsecase.execute(schedule)
  revalidatePath('/command/schedule')
}

export async function createManySchedule(schedule: (Omit<ISchedule, "id" | "created_at">)[]) {
  await createManyScheduleUsecase.execute(schedule)
  revalidatePath('/command/schedule')
}

export async function findOneSchedule(schedule: Partial<ISchedule>) {
  return await findOneScheduleUsecase.execute(schedule)
}

export async function updateOneScheduleById(
  query: { id: string },
  value: Omit<ISchedule, "id" | "created_at">,
) {
  await updateOneScheduleUsecase.execute(query, value)
  revalidatePath('/command/schedule')
}

export async function updateManyScheduleById(
  query: { id: string[] },
  value: Omit<ISchedule, "id" | "created_at">,
) {
  await updateManyScheduleUsecase.execute(query, value)
  revalidatePath('/command/schedule')
}

export async function updateBulkSchedule(operations: {
  query: { id: string },
  value: Omit<ISchedule, "id" | "created_at">,
}[]) {
  await updateBulkScheduleUsecase.execute(operations)
  revalidatePath('/command/schedule')
}

export async function deleteOneScheduleById(query: { id: string }) {
  await deleteOneScheduleUsecase.execute(query)
  revalidatePath('/command/schedule')
}

export async function findAllSchedule(): Promise<(ISchedule & { device: IDevice, command: ICommand, firmware?: IFirmware })[]> {
  return await findAllScheduleUsecase.execute()
}

export async function findManyPendingScheduleBySerial(serial: string): Promise<(ISchedule & { device: IDevice, command: ICommand, firmware?: IFirmware })[]> {
  return await findManyPendingScheduleBySerialUsecase.execute(serial)
}




