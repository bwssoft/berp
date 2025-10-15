import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IIdentificationLog } from "@/backend/domain/production/entity/identification-log.definition";

export interface IIdentificationLogRepository
  extends IBaseRepository<IIdentificationLog> {}
