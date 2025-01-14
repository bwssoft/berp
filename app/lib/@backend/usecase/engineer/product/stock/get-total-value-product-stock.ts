import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductStockRepository } from "@/app/lib/@backend/domain"
import { productStockRepository } from "@/app/lib/@backend/infra"

class GetTotalValueProductStockUsecase {
  repository: IProductStockRepository

  constructor() {
    this.repository = productStockRepository
  }

  async execute(product_id: string) {
    const pipeline = this.pipeline(product_id)
    const aggregate = await this.repository.aggregate(pipeline)
    const [result] = await aggregate.toArray()
    return result as
      {
        product: IProduct
        balance: number
        total_cost: number
        unit_cost: number
      }
  }

  pipeline(product_id: string) {
    const pipeline = [
      {
        $match: { product_id }
      },
      {
        $lookup: {
          from: "product",
          localField: "product_id",
          foreignField: "id",
          as: "product"
        }
      },
      {
        $lookup: {
          from: "input",
          localField: "product.inputs.input_id",
          foreignField: "id",
          as: "inputs"
        }
      },
      {
        $addFields: {
          cost: {
            $sum: {
              $map: {
                input: { $arrayElemAt: ["$product.inputs", 0] },
                as: "productInput",
                in: {
                  $multiply: [
                    {
                      $arrayElemAt: [
                        "$inputs.price",
                        {
                          $indexOfArray: [
                            "$inputs.id",
                            "$$productInput.input_id"
                          ]
                        }
                      ]
                    },
                    "$$productInput.quantity"
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          product: { $first: ["$product"] },
          balance: 1,
          total_cost: { $multiply: ["$cost", "$balance"] },
          unit_cost: "$cost"
        }
      }
    ]
    return pipeline
  }
}

export const getTotalValueProductStockUsecase = singleton(GetTotalValueProductStockUsecase)
