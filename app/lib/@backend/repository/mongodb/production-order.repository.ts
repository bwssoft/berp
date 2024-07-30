import { singleton } from "@/app/lib/util/singleton";
import { IProduct, IProductionOrder } from "@/app/lib/@backend/domain";
import { BaseRepository } from "./@base/base";

class ProductionOrderRepository extends BaseRepository<IProductionOrder> {
  constructor() {
    super({
      collection: "production-order",
      db: "berp"
    });
  }

}

export const productionOrderRepository = singleton(ProductionOrderRepository)
