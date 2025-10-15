import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IAccountEconomicGroup } from "@/backend/domain/commercial/entity/account.economic-group.definition";

export interface IAccountEconomicGroupRepository
  extends IBaseRepository<IAccountEconomicGroup> {}
