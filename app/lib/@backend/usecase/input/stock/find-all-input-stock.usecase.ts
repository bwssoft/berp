import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputStockRepository } from "@/app/lib/@backend/domain"
import { inputStockRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllInputStockUsecase {
  repository: IInputStockRepository

  constructor() {
    this.repository = inputStockRepository
  }

  async execute(input_id?: string) {
    const pipeline = this.pipeline(input_id)
    const aggregate = await this.repository.aggregate(pipeline)
    return await aggregate.toArray() as
      {
        input: IInput
        enter: number
        exit: number
        balance: number
        cumulative_price: number
      }[]
  }

  pipeline(input_id?: string) {
    const match: any = {
      $match: {}
    }
    if (input_id) {
      match.$match = {
        ...match.$match,
        input_id
      }
    }
    const pipeline = [
      match,
      // Ordena os documentos por input_id, year, month, day em ordem decrescente
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
          _id: 0,
          input: { $first: ["$input"] },
          enter: 1,
          exit: 1,
          balance: 1,
          cumulative_price: {
            $multiply: [
              "$balance",
              { $arrayElemAt: ["$input.price", 0] }
            ]
          }
        }
      },
      {
        $match: {
          input: { $exists: true }
        }
      }
    ]
    return pipeline
  }
}

export const findAllInputStockUsecase = singleton(FindAllInputStockUsecase)
