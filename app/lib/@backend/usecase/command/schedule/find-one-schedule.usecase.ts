import { singleton } from "@/app/lib/util/singleton"
import { ISchedule, IScheduleRepository } from "@/app/lib/@backend/domain"
import { scheduleRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneScheduleUsecase {
  repository: IScheduleRepository

  constructor() {
    this.repository = scheduleRepository
  }

  async execute(args: Partial<ISchedule>) {
    return await this.repository.findOne(args)
  }
}

export const findOneScheduleUsecase = singleton(FindOneScheduleUsecase)
