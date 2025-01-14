import {
  IProductionOrder,
  IProductionOrderRepository,
} from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class ProductionOrderRepository
  extends BaseRepository<IProductionOrder>
  implements IProductionOrderRepository {
  constructor() {
    super({
      collection: "production-order",
      db: "berp",
    });
  }
}

export const productionOrderRepository = singleton(ProductionOrderRepository);
