import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";

export interface IScheduleRepository extends IBaseRepository<ISchedule> { }
