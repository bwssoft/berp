import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductTransaction, IProductTransactionRepository } from "@/app/lib/@backend/domain"
import { productTransactionRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllProductTransactionWithProductUsecase {
  repository: IProductTransactionRepository

  constructor() {
    this.repository = productTransactionRepository
  }

  async execute() {
    const pipeline = this.pipeline()
    const aggragate = await this.repository.aggregate(pipeline)
    return await aggragate.toArray() as (IProductTransaction & { product: IProduct })[]
  }

  pipeline() {
    const pipeline = [
      { $match: {} },
      {
        $lookup: {
          as: "product",
          from: "product",
          localField: "product_id",
          foreignField: "id"
        }
      },
      {
        $project: {
          quantity: 1,
          created_at: 1,
          type: 1,
          product: { $first: "$product" },
        }
      },
      {
        $match: {
          product: { $exists: true }
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

export const findAllProductTransactionWithProductUsecase = singleton(FindAllProductTransactionWithProductUsecase)
