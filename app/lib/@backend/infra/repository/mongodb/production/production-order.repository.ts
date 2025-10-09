import IProductionOrder from "@/app/lib/@backend/domain/production/entity/production-order.definition";
import IProductionOrderRepository from "@/app/lib/@backend/domain/production/repository/production-order.repository.interface";
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
