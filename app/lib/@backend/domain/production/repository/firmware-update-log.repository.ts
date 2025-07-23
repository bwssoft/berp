import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IFirmwareUpdateLog } from "../entity";

export interface IFirmwareUpdateLogRepository
  extends IBaseRepository<IFirmwareUpdateLog> {}
