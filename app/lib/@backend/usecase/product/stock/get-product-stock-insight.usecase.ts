import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductStockRepository } from "@/app/lib/@backend/domain"
import { productStockRepository } from "@/app/lib/@backend/repository/mongodb"

class GetProductStockInsightUsecase {
  repository: IProductStockRepository

  constructor() {
    this.repository = productStockRepository
  }

  async execute() {
    const pipeline = this.pipeline()
    const aggregate = await this.repository.aggregate(pipeline)
    return await aggregate.toArray() as
      {
        max_balance: { value: number, product: IProduct }
        min_balance: { value: number, product: IProduct }
        max_unit_cost: { value: number, product: IProduct }
        min_unit_cost: { value: number, product: IProduct }
        max_total_cost: { value: number, product: IProduct }
        min_total_cost: { value: number, product: IProduct }
        total_value: number
      }[]
  }

  pipeline() {
    const match = {
      $match: {}
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
          balance: 1
        }
      },
      {
        $match: {
          product: { $exists: true }
        }
      },
      // Estágio para encontrar os itens com maior e menor quantidade, maior e menor valor unitário, e maior e menor valor total
      {
        $group: {
          _id: null,
          max_balance: {
            $max: {
              value: "$balance",
              product: "$$ROOT.product"
            }
          },
          min_balance: {
            $min: {
              value: "$balance",
              product: "$$ROOT.product"
            }
          },
          max_unit_cost: {
            $max: {
              value: "$cost",
              product: "$$ROOT.product"
            }
          },
          min_unit_cost: {
            $min: {
              value: "$cost",
              product: "$$ROOT.product"
            }
          },
          max_total_cost: {
            $max: {
              value: "$total_cost",
              product: "$$ROOT.product"
            }
          },
          min_total_cost: {
            $min: {
              value: "$total_cost",
              product: "$$ROOT.product"
            }
          },
          total_value: {
            $sum: "$total_cost"
          }
        }
      }
    ]
    return pipeline
  }
}

export const getProductStockInsightUsecase = singleton(GetProductStockInsightUsecase)
