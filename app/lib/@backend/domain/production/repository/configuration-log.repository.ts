import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IConfigurationLog } from "../entity";

export interface IConfigurationLogRepository
  extends IBaseRepository<IConfigurationLog> {}
