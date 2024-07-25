"use server"

import { revalidatePath } from "next/cache"
import { ISchedule } from "../../domain"
import {
  createOneScheduleUsecase,
  findOneScheduleUsecase,
  deleteOneScheduleUsecase,
  updateOneScheduleUsecase,
  findAllScheduleUsecase
} from "../../usecase"

export async function createOneSchedule(schedule: Omit<ISchedule, "id" | "created_at">) {
  await createOneScheduleUsecase.execute(schedule)
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

export async function findAllSchedule(): Promise<ISchedule[]> {
  return await findAllScheduleUsecase.execute()
}


