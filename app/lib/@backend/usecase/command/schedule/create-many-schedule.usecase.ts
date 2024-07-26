import { singleton } from "@/app/lib/util/singleton"
import { ISchedule, IScheduleRepository } from "@/app/lib/@backend/domain"
import { scheduleRepository } from "@/app/lib/@backend/repository/mongodb"

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
    console.log('_schedules', _schedules)
    return await this.repository.createMany(_schedules)
  }
}

export const createManyScheduleUsecase = singleton(CreateManyScheduleUsecase)
