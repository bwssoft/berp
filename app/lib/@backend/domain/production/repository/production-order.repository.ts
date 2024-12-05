import { UpdateResult } from "mongodb";
import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IProductionOrder } from "../entity";

export interface IProductionOrderRepository extends IBaseRepository<IProductionOrder> {
  linkProductionProcess: (
    query: Pick<IProductionOrder, 'id'>,
    value: {
      process_uuid: string,
    }
  ) => Promise<UpdateResult<IProductionOrder>>
}