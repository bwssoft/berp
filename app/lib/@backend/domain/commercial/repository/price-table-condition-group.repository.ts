import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IPriceTableConditionGroup } from "../entity/price-table-condition.definition";

export interface IPriceTableConditionGroupRepository
  extends IBaseRepository<IPriceTableConditionGroup> {}
