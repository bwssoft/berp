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

  async findAllWithProduct() {
    const db = await this.connect();
    return await db.collection<IProductionOrder>(this.collection).aggregate([
      { $match: {} },
      {
        $lookup: {
          as: "_products",
          from: "product",
          localField: "products.product_id",
          foreignField: "id"
        }
      },
      {
        $project: {
          id: 1,
          created_at: 1,
          products: 1,
          stage: 1,
          _products: 1,
        }
      },
    ]).toArray();
  }
}

export default ProductionOrderRepository.getInstance();
