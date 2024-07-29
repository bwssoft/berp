import { singleton } from "@/app/lib/util/singleton"
import { ISchedule, IScheduleRepository } from "@/app/lib/@backend/domain"
import { scheduleRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateManyScheduleUsecase {
  repository: IScheduleRepository

  constructor() {
    this.repository = scheduleRepository
  }

  async execute(
    query: { id: string[] },
    value: Omit<ISchedule, "id" | "created_at">,
  ) {
    const _query = { id: { $in: query.id } }
    return await this.repository.updateMany(_query, value)
  }
}

export const updateManyScheduleUsecase = singleton(UpdateManyScheduleUsecase)
