import { singleton } from "@/app/lib/util/singleton"
import { ISchedule, IScheduleRepository } from "@/app/lib/@backend/domain"
import { scheduleRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateBulkScheduleUsecase {
  repository: IScheduleRepository

  constructor() {
    this.repository = scheduleRepository
  }

  async execute(operations: {
    query: { id: string },
    value: Omit<ISchedule, "id" | "created_at">,
  }[]) {
    return await this.repository.updateBulk(operations)
  }
}

export const updateBulkScheduleUsecase = singleton(UpdateBulkScheduleUsecase)
