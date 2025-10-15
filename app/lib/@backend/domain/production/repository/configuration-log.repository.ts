import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IConfigurationLog } from "@/backend/domain/production/entity/configuration-log.definition";

export interface IConfigurationLogRepository
  extends IBaseRepository<IConfigurationLog> {}
