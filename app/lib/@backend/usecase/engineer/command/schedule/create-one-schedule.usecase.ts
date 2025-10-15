import { singleton } from "@/app/lib/util/singleton";
import type { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import type { IScheduleRepository } from "@/backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/backend/infra";

class CreateOneScheduleUsecase {
  repository: IScheduleRepository;

  constructor() {
    this.repository = scheduleRepository;
  }

  async execute(schedule: Omit<ISchedule, "id" | "created_at">) {
    const _schedule = Object.assign(schedule, {
      id: crypto.randomUUID(),
      created_at: new Date(),
    });
    await this.repository.create(_schedule);

    return schedule;
  }
}

export const createOneScheduleUsecase = singleton(CreateOneScheduleUsecase);

