import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IIdentification } from "../entity/identification.definition";

export interface IIdentificationRepository
  extends IBaseRepository<IIdentification> {}
