import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IAutoTestLog } from "@/backend/domain/production/entity/auto-test-log.definition";

export interface IAutoTestLogRepository extends IBaseRepository<IAutoTestLog> {}
