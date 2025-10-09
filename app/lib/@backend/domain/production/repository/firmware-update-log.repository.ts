import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IFirmwareUpdateLog } from "@/backend/domain/production/entity/firmware-update-log.definition";

export interface IFirmwareUpdateLogRepository
  extends IBaseRepository<IFirmwareUpdateLog> {}
