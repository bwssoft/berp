import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductionOrder, IProductionOrderRepository } from "@/app/lib/@backend/domain"
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllProductionOrderWithInputUsecase {
  repository: IProductionOrderRepository

  constructor() {
    this.repository = productionOrderRepository
  }

  async execute() {
    const pipeline = this.pipeline()
    const aggregate = await this.repository.aggregate(pipeline)
    return await aggregate.toArray() as (IProductionOrder & { _products: IProduct[] })[]
  }

  pipeline() {
    const pipeline = [
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
