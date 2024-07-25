import { singleton } from "@/app/lib/util/singleton"
import { IScheduleRepository } from "@/app/lib/@backend/domain"
import { scheduleRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllScheduleUsecase {
  repository: IScheduleRepository

  constructor() {
    this.repository = scheduleRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllScheduleUsecase = singleton(FindAllScheduleUsecase)
