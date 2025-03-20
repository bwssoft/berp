import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IDeviceIdentificationLog } from "../entity";

export interface IDeviceIdentificationLogRepository
  extends IBaseRepository<IDeviceIdentificationLog> {}
