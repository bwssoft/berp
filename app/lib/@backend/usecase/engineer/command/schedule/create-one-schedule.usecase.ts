import { singleton } from "@/app/lib/util/singleton"
import { ISchedule } from "@/app/lib/@backend/domain/engineer/entity/command-schedule.definition";
import { IScheduleRepository } from "@/app/lib/@backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/app/lib/@backend/infra"

class CreateOneScheduleUsecase {
  repository: IScheduleRepository

  constructor() {
    this.repository = scheduleRepository
  }

  async execute(schedule: Omit<ISchedule, "id" | "created_at">) {
    const _schedule = Object.assign(
      schedule,
      {
        id: crypto.randomUUID(),
        created_at: new Date()
      }
    )
    await this.repository.create(_schedule)

    return schedule
  }
}

export const createOneScheduleUsecase = singleton(CreateOneScheduleUsecase)
