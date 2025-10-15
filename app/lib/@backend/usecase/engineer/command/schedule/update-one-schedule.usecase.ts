
import { singleton } from "@/app/lib/util/singleton";
import type { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import type { IScheduleRepository } from "@/backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/backend/infra";

class UpdateOneScheduleUsecase {
  repository: IScheduleRepository;

  constructor() {
    this.repository = scheduleRepository;
  }

  async execute(
    query: { id: string },
    value: Omit<ISchedule, "id" | "created_at">
  ) {
    return await this.repository.updateOne(query, { $set: value });
  }
}

export const updateOneScheduleUsecase = singleton(UpdateOneScheduleUsecase);
