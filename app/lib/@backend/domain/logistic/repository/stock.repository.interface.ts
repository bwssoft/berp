import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IStock } from "@/backend/domain/logistic/entity/stock.entity";

export interface IStockRepository extends IBaseRepository<IStock> {}
