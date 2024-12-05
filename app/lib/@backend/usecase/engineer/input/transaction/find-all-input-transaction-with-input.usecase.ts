import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputTransaction, IInputTransactionRepository } from "@/app/lib/@backend/domain"
import { inputTransactionRepository } from "@/app/lib/@backend/infra"

class FindAllInputTransactionWithInputUsecase {
  repository: IInputTransactionRepository

  constructor() {
    this.repository = inputTransactionRepository
  }

  async execute() {
    const pipeline = this.pipeline()
    const aggragate = await this.repository.aggregate(pipeline)
    return await aggragate.toArray() as (IInputTransaction & { input: IInput })[]
  }

  pipeline() {
    const pipeline = [
      { $match: {} },
      {
        $lookup: {
          as: "input",
          from: "input",
          localField: "input_id",
          foreignField: "id"
        }
      },
      {
        $project: {
          quantity: 1,
          created_at: 1,
          type: 1,
          input: { $first: "$input" },
        }
      },
      {
        $match: {
          input: { $exists: true }
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

export const findAllInputTransactionWithInputUsecase = singleton(FindAllInputTransactionWithInputUsecase)
