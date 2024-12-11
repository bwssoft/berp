import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IFinancialOrder } from "../entity";

export interface IFinancialOrderRepository extends IBaseRepository<IFinancialOrder> { }