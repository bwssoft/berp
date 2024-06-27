import { IProductionOrder } from "../../definition/production-order.definition";
import { BaseRepository } from "./@base/base";

class ProductionOrderRepository extends BaseRepository<IProductionOrder> {
  private static instance: ProductionOrderRepository;

  private constructor() {
    super({
      collection: "production-order",
      db: "bstock"
    });
  }

  public static getInstance(): ProductionOrderRepository {
    if (!ProductionOrderRepository.instance) {
      ProductionOrderRepository.instance = new ProductionOrderRepository();
    }
    return ProductionOrderRepository.instance;
  }
}

export default ProductionOrderRepository.getInstance();
