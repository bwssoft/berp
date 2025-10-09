import { singleton } from "@/app/lib/util/singleton";
import { ISchedule } from "@/app/lib/@backend/domain/engineer/entity/command-schedule.definition";
import { BaseRepository } from "../@base";

class ScheduleRepository extends BaseRepository<ISchedule> {
  constructor() {
    super({
      collection: "command-schedule",
      db: "berp"
    });
  }
}

export const scheduleRepository = singleton(ScheduleRepository)
