import { singleton } from "@/app/lib/util/singleton"
import { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import { IScheduleRepository } from "@/backend/domain/engineer/repository/command-schedule.repository";
import { scheduleRepository } from "@/backend/infra"

class CreateManyScheduleUsecase {
  repository: IScheduleRepository

  constructor() {
    this.repository = scheduleRepository
  }

  async execute(schedules: Omit<ISchedule, "id" | "created_at">[]) {
    const _schedules = schedules.map(i => Object.assign(i, {
      created_at: new Date(),
      id: crypto.randomUUID()
    }))
    return await this.repository.createMany(_schedules)
  }
}

export const createManyScheduleUsecase = singleton(CreateManyScheduleUsecase)

