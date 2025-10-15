import type { IProductionOrder } from "@/backend/domain/production/entity/production-order.definition";
import type { IProductionOrderRepository } from "@/backend/domain/production/repository/production-order.repository";
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


