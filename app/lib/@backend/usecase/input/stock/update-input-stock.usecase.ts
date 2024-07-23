import { singleton } from "@/app/lib/util/singleton"
import { IInputTransactionRepository } from "@/app/lib/@backend/domain"
import { inputTransactionRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateInputStockUsacase {
  repository: IInputTransactionRepository

  constructor() {
    this.repository = inputTransactionRepository
  }

  async execute() {
    const stockTemporalPipeline = this.stockTemporalPipeline()
    const stockPipeline = this.stockPipeline()
    const stockTemporalAggregate = await this.repository.aggregate(stockTemporalPipeline)
    const stockAggregate = await this.repository.aggregate(stockPipeline)
    await Promise.all([stockTemporalAggregate.toArray(), stockAggregate.toArray()])
  }

  stockTemporalPipeline() {
    const pipeline = [
      {
        $match: {}
      },
      {
        $addFields: {
          day: {
            $dayOfMonth: "$created_at"
          },
          year: {
            $year: "$created_at"
          },
          month: {
            $month: "$created_at"
          }
        }
      },
      {
        $group: {
          _id: {
            input_id: "$input_id",
            year: "$year",
            month: "$month",
            day: "$day"
          },
          enter: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$type", "enter"]
                },
                then: "$quantity",
                else: 0
              }
            }
          },
          exit: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$type", "exit"]
                },
                then: "$quantity",
                else: 0
              }
            }
          }
        }
      },
      {
        $project: {
          input_id: "$_id.input_id",
          date: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day"
          },
          enter: 1,
          exit: 1,
          balance: {
            $subtract: ["$enter", "$exit"]
          }
        }
      },
      {
        $sort: {
          input_id: 1,
          "date.day": 1,
          "date.month": 1,
          "date.year": 1
        }
      },
      {
        $setWindowFields: {
          partitionBy: "$input_id",
          sortBy: {
            "date.day": 1,
            "date.month": 1,
            "date.year": 1
          },
          output: {
            cumulative_balance: {
              $sum: "$balance",
              window: {
                documents: ["unbounded", "current"]
              }
            }
          }
        }
      },
      {
        $merge: {
          into: "input-temporal-stock",
          on: ["input_id", "date"],
          whenMatched: "merge",
          whenNotMatched: "insert"
        }
      }
    ]

    return pipeline
  }
  stockPipeline() {
    const pipeline = [
      {
        $match: {}
      },
      {
        $group: {
          _id: "$input_id",
          enter: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$type", "enter"]
                },
                then: "$quantity",
                else: 0
              }
            }
          },
          exit: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$type", "exit"]
                },
                then: "$quantity",
                else: 0
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          input_id: "$_id",
          enter: 1,
          exit: 1,
          balance: {
            $subtract: ["$enter", "$exit"]
          }
        }
      },
      {
        $merge: {
          into: "input-stock",
          on: ["input_id"],
          whenMatched: "merge",
          whenNotMatched: "insert"
        }
      }
    ]
    return pipeline
  }
}

export const updateInputStockUsacase = singleton(UpdateInputStockUsacase)
