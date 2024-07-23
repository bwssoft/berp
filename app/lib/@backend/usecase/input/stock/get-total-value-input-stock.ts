import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputStockRepository } from "@/app/lib/@backend/domain"
import { inputStockRepository } from "@/app/lib/@backend/repository/mongodb"

class GetTotalValueInputStockUsecase {
  repository: IInputStockRepository

  constructor() {
    this.repository = inputStockRepository
  }

  async execute(input_id: string) {
    const pipeline = this.pipeline(input_id)
    const aggregate = await this.repository.aggregate(pipeline)
    const [result] = await aggregate.toArray()
    return result as
      {
        input: IInput
        balance: number
        cumulative_price: number
      }
  }

  pipeline(input_id: string) {
    const pipeline = [
      {
        $match: {
          input_id
        }
      },
      {
        $lookup: {
          from: "input",
          localField: "input_id",
          foreignField: "id",
          as: "input"
        }
      },
      {
        $project: {
          input: { $first: ["$input"] },
          balance: 1,
          cumulative_price: { $multiply: [{ $arrayElemAt: ["$input.price", 0] }, "$balance"] }
        }
      }
    ]
    return pipeline
  }
}

export const getTotalValueInputStockUsecase = singleton(GetTotalValueInputStockUsecase)
