import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IProductionOrder } from "@/backend/domain/production/entity/production-order.definition";

export interface IProductionOrderRepository extends IBaseRepository<IProductionOrder> { }
