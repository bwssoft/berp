import { singleton } from "@/app/lib/util/singleton"
import { ISchedule } from "@/app/lib/@backend/domain/engineer/entity/command-schedule.definition";
import { IScheduleRepository } from "@/app/lib/@backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/app/lib/@backend/infra"

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
    return await this.repository.updateMany(_query, { $set: value })
  }
}

export const updateManyScheduleUsecase = singleton(UpdateManyScheduleUsecase)
