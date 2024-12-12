import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IClient, IOpportunity } from "../entity";

export interface IOpportunityRepository extends IBaseRepository<IOpportunity> { }