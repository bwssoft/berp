import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IAccountEconomicGroup } from "../entity/account.economic-group.definition";

export interface IAccountEconomicGroupRepository
  extends IBaseRepository<IAccountEconomicGroup> {}
