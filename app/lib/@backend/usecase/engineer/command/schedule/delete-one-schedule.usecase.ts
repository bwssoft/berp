
import { singleton } from "@/app/lib/util/singleton";
import type { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import type { IScheduleRepository } from "@/backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/backend/infra";

class DeleteOneScheduleUsecase {
  repository: IScheduleRepository;

  constructor() {
    this.repository = scheduleRepository;
  }

  async execute(input: Partial<ISchedule>) {
    return await this.repository.deleteOne(input);
  }
}

export const deleteOneScheduleUsecase = singleton(DeleteOneScheduleUsecase);
