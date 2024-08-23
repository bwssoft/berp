import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductionOrder, IProductionOrderRepository, ISaleOrder } from "@/app/lib/@backend/domain"
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllProductionOrderWithInputUsecase {
  repository: IProductionOrderRepository

  constructor() {
    this.repository = productionOrderRepository
  }

  async execute() {
    const pipeline = this.pipeline()
    const aggregate = await this.repository.aggregate(pipeline)
    return await aggregate.toArray() as (IProductionOrder & { sale_order: ISaleOrder, products_in_sale_order: IProduct[] })[]
  }

  pipeline() {
    const pipeline = [
      { $match: {} },
      {
        $lookup: {
          as: "sale_order",
          from: "sale-order",
          localField: "sale_order_id",
          foreignField: "id"
        }
      },
      {
        $lookup: {
          as: "products_in_sale_order",
          from: "product",
          localField: "sale_order.products.product_id",
          foreignField: "id"
        }
      },
      {
        $project: {
          id: 1,
          created_at: 1,
          products: 1,
          stage: 1,
          sale_order: { $first: "$sale_order" },
          products_in_sale_order: 1
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ]
    return pipeline
  }
}

export const findAllProductionOrderWithProductUsecase = singleton(FindAllProductionOrderWithInputUsecase)
