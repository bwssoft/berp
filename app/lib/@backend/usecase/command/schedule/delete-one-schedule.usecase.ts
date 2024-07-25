import { singleton } from "@/app/lib/util/singleton"
import { ISchedule, IScheduleRepository } from "@/app/lib/@backend/domain"
import { scheduleRepository } from "@/app/lib/@backend/repository/mongodb"

class DeleteOneScheduleUsecase {
  repository: IScheduleRepository

  constructor() {
    this.repository = scheduleRepository
  }

  async execute(input: Partial<ISchedule>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneScheduleUsecase = singleton(DeleteOneScheduleUsecase)
