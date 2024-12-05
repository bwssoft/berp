import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductStockRepository } from "@/app/lib/@backend/domain"
import { productStockRepository } from "@/app/lib/@backend/infra"

class FindAllProductStockUsecase {
  repository: IProductStockRepository

  constructor() {
    this.repository = productStockRepository
  }

  async execute(product_id?: string) {
    const pipeline = this.pipeline(product_id)
    const aggregate = await this.repository.aggregate(pipeline)
    return await aggregate.toArray() as
      {
        product: IProduct
        enter: number
        exit: number
        balance: number
        unit_cost: number
        total_cost: number
      }[]
  }

  pipeline(product_id?: string) {
    const match = {
      $match: {}
    }
    if (product_id) {
      match.$match = {
        ...match.$match,
        product_id
      }
    }
    const pipeline = [
      match,
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
          _id: 0,
          product: { $first: ["$product"] },
          unit_cost: "$cost",
          total_cost: { $multiply: ["$cost", "$balance"] },
          enter: 1,
          exit: 1,
          balance: 1
        }
      },
      {
        $match: {
          product: { $exists: true }
        }
      }
    ]
    return pipeline
  }
}

export const findAllProductStockUsecase = singleton(FindAllProductStockUsecase)
