"use server"

import { revalidatePath } from "next/cache"
import { ICommand, IDevice, IFirmware, ISchedule } from "../../domain"
import {
  createOneScheduleUsecase,
  findOneScheduleUsecase,
  deleteOneScheduleUsecase,
  updateOneScheduleUsecase,
  findAllScheduleUsecase,
  createManyScheduleUsecase,
  findManyScheduleBySerialUsecase
} from "../../usecase"

export async function createOneSchedule(schedule: Omit<ISchedule, "id" | "created_at">) {
  await createOneScheduleUsecase.execute(schedule)
  revalidatePath('/schedule/management')
}

export async function createManySchedule(schedule: (Omit<ISchedule, "id" | "created_at">)[]) {
  await createManyScheduleUsecase.execute(schedule)
  revalidatePath('/schedule/management')
}

export async function findOneSchedule(schedule: Partial<ISchedule>) {
  return await findOneScheduleUsecase.execute(schedule)
}

export async function updateOneScheduleById(
  query: { id: string },
  value: Omit<ISchedule, "id" | "created_at">,
) {
  await updateOneScheduleUsecase.execute(query, value)
  revalidatePath('/schedule/management')
}

export async function deleteOneScheduleById(query: { id: string }) {
  await deleteOneScheduleUsecase.execute(query)
  revalidatePath('/schedule/management')
}

export async function findAllSchedule(): Promise<(ISchedule & { device: IDevice, command: ICommand, firmware?: IFirmware })[]> {
  return await findAllScheduleUsecase.execute()
}

export async function findManyScheduleBySerial(serial: string): Promise<(ISchedule & { device: IDevice, command: ICommand, firmware?: IFirmware })[]> {
  return await findManyScheduleBySerialUsecase.execute(serial)
}




