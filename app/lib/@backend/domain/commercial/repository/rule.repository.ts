import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IRule } from "@/backend/domain/commercial/entity/rule.definition";

export interface IRuleRepository extends IBaseRepository<IRule> { }
