import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IFinancialOrder } from "@/backend/domain/financial/entity/financial-order.definition";

export interface IFinancialOrderRepository extends IBaseRepository<IFinancialOrder> { }
