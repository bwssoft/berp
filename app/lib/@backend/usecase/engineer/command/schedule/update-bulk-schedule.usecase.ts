import { singleton } from "@/app/lib/util/singleton";
import { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import { IScheduleRepository } from "@/backend/domain/engineer/repository/command-schedule.repository";
import { scheduleRepository } from "@/backend/infra";

class UpdateBulkScheduleUsecase {
  repository: IScheduleRepository;

  constructor() {
    this.repository = scheduleRepository;
  }

  async execute(
    operations: {
      query: { id: string };
      value: Omit<ISchedule, "id" | "created_at">;
    }[]
  ) {
    return await this.repository.updateBulk(
      operations.map(({ query, value }) => ({
        filter: query,
        update: { $set: value },
        upsert: false,
      }))
    );
  }
}

export const updateBulkScheduleUsecase = singleton(UpdateBulkScheduleUsecase);

