import { ISchedule } from "@/app/lib/@backend/domain/engineer/entity/command-schedule.definition";
import { IScheduleRepository } from "@/app/lib/@backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";;

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
