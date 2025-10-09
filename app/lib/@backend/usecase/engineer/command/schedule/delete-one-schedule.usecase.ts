import { singleton } from "@/app/lib/util/singleton"
import { ISchedule } from "@/app/lib/@backend/domain/engineer/entity/command-schedule.definition";
import { IScheduleRepository } from "@/app/lib/@backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/app/lib/@backend/infra"

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
