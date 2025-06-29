import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IStock } from "../entity";

export interface IStockRepository extends IBaseRepository<IStock> {}
