
import { singleton } from "@/app/lib/util/singleton";
import type { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import type { IScheduleRepository } from "@/backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/backend/infra";

class CreateManyScheduleUsecase {
  repository: IScheduleRepository;

  constructor() {
    this.repository = scheduleRepository;
  }

  async execute(schedules: Omit<ISchedule, "id" | "created_at">[]) {
    const payload = schedules.map((schedule) =>
      Object.assign(schedule, {
        id: crypto.randomUUID(),
        created_at: new Date(),
      })
    );

    return await this.repository.createMany(payload);
  }
}

export const createManyScheduleUsecase = singleton(CreateManyScheduleUsecase);
