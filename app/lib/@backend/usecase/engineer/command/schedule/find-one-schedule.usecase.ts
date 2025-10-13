import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import type { IScheduleRepository } from "@/backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/backend/infra";

class FindOneScheduleUsecase {
  repository: IScheduleRepository;

  constructor() {
    this.repository = scheduleRepository;
  }

  @RemoveMongoId()
  async execute(args: Partial<ISchedule>) {
    return await this.repository.findOne(args);
  }
}

export const findOneScheduleUsecase = singleton(FindOneScheduleUsecase);

