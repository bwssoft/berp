import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputStockRepository } from "@/app/lib/@backend/domain"
import { inputStockRepository } from "@/app/lib/@backend/repository/mongodb"

class GetInputStockInsightUsecase {
  repository: IInputStockRepository

  constructor() {
    this.repository = inputStockRepository
  }

  async execute() {
    const pipeline = this.pipeline()
    const aggregate = await this.repository.aggregate(pipeline)
    return await aggregate.toArray() as
      {
        max_balance: { value: number, input: IInput }
        min_balance: { value: number, input: IInput }
        max_unit_price: { value: number, input: IInput }
        min_unit_price: { value: number, input: IInput }
        max_cumulative_price: { value: number, input: IInput }
        min_cumulative_price: { value: number, input: IInput }
        total_value: number
      }[]
  }

  pipeline() {
    const match: any = {
      $match: {}
    }
    const pipeline = [
      match,
      {
        $lookup: {
          from: "input",
          localField: "input_id",
          foreignField: "id",
          as: "input"
        }
      },
      // Projetar os campos desejados
      {
        $project: {
          _id: 0,
          balance: 1,
          cumulative_price: {
            $multiply: [
              "$balance",
              { $arrayElemAt: ["$input.price", 0] }
            ]
          },
          input: { $arrayElemAt: ["$input", 0] }
        }
      },
      {
        $match: {
          input: { $exists: true }
        }
      },
      // Estágio para encontrar os itens com maior e menor quantidade, maior e menor valor unitário, e maior e menor valor total
      {
        $group: {
          _id: null,
          max_balance: {
            $max: {
              value: "$balance",
              input: "$$ROOT.input"
            }
          },
          min_balance: {
            $min: {
              value: "$balance",
              input: "$$ROOT.input"
            }
          },
          max_unit_price: {
            $max: {
              value: "$input.price",
              input: "$$ROOT.input"
            }
          },
          min_unit_price: {
            $min: {
              value: "$input.price",
              input: "$$ROOT.input"
            }
          },
          max_cumulative_price: {
            $max: {
              value: "$cumulative_price",
              input: "$$ROOT.input"
            }
          },
          min_cumulative_price: {
            $min: {
              value: "$cumulative_price",
              input: "$$ROOT.input"
            }
          },
          total_value: {
            $sum: "$cumulative_price"
          }
        }
      }
    ]
    return pipeline
  }
}

export const getInputStockInsightUsecase = singleton(GetInputStockInsightUsecase)
