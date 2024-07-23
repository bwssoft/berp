import { singleton } from "@/app/lib/util/singleton"
import { IInputTransactionRepository } from "@/app/lib/@backend/domain"
import { inputTransactionRepository } from "@/app/lib/@backend/repository/mongodb"

class CountInputTransactionUsecase {
  repository: IInputTransactionRepository

  constructor() {
    this.repository = inputTransactionRepository
  }

  async execute(input_id?: string) {
    const pipeline = this.pipeline(input_id)
    const aggregation = await this.repository.aggregate<{
      total: number
      enter: number
      exit: number
      ratioEnterExit: number
    }>(pipeline)

    const [result] = await aggregation.toArray()

    return result
  }

  pipeline(input_id?: string) {
    const match = { $match: {} }

    if (input_id) {
      match.$match = {
        ...match.$match,
        input_id
      }
    }

    const pipeline = [
      match,
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          enter: {
            $sum: {
              $cond: {
                if: { $eq: ["$type", "enter"] },
                then: 1,
                else: 0
              }
            }
          },
          exit: {
            $sum: {
              $cond: {
                if: { $eq: ["$type", "exit"] },
                then: 1,
                else: 0
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          enter: 1,
          exit: 1,
          ratioEnterExit: {
            $cond: {
              if: { $eq: ["$exit", 0] },
              then: 0,
              else: {
                $divide: ["$enter", "$exit"]
              }
            }
          }
        }
      }
    ]

    return pipeline

  }
}

export const countInputTransactionUsecase = singleton(CountInputTransactionUsecase)
