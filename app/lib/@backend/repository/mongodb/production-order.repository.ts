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
    ]).toArray() as (IProductionOrder & { _products: IProduct[] })[]
  }
}

export const productionOrderRepository = singleton(ProductionOrderRepository)
