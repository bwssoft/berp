
import { singleton } from "@/app/lib/util/singleton";
import type { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import type { IScheduleRepository } from "@/backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/backend/infra";

class UpdateManyScheduleUsecase {
  repository: IScheduleRepository;

  constructor() {
    this.repository = scheduleRepository;
  }

  async execute(
    query: { id: string[] },
    value: Omit<ISchedule, "id" | "created_at">
  ) {
    const filter = { id: { $in: query.id } };
    return await this.repository.updateMany(filter, { $set: value });
  }
}

export const updateManyScheduleUsecase = singleton(UpdateManyScheduleUsecase);
