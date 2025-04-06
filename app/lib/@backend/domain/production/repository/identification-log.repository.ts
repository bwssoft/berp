import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IIdentificationLog } from "../entity";

export interface IIdentificationLogRepository
  extends IBaseRepository<IIdentificationLog> {}
