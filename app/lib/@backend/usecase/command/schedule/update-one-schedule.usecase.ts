import { singleton } from "@/app/lib/util/singleton"
import { ISchedule, IScheduleRepository } from "@/app/lib/@backend/domain"
import { scheduleRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateOneScheduleUsecase {
  repository: IScheduleRepository

  constructor() {
    this.repository = scheduleRepository
  }

  async execute(
    query: { id: string },
    value: Omit<ISchedule, "id" | "created_at">,
  ) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneScheduleUsecase = singleton(UpdateOneScheduleUsecase)
