import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IProduct } from "../../product/entity";
import { IProductionOrder } from "../entity";

export interface IProductionOrderRepository extends IBaseRepository<IProductionOrder> {
  findAllWithProduct(): Promise<(IProductionOrder & { _products: IProduct[] })[]>
}