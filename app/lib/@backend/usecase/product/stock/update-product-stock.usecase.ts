import { singleton } from "@/app/lib/util/singleton"
import { IProductTransactionRepository } from "@/app/lib/@backend/domain"
import { productTransactionRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateProductStockUsacase {
  repository: IProductTransactionRepository

  constructor() {
    this.repository = productTransactionRepository
  }

  async execute() {
    const stockTemporalPipeline = this.stockTemporalPipeline()
    const stockPipeline = this.stockPipeline()
    const stockTemporalAggregate = await this.repository.aggregate(stockTemporalPipeline)
    const stockAggregate = await this.repository.aggregate(stockPipeline)
    await Promise.all([stockTemporalAggregate.toArray(), stockAggregate.toArray()])
  }

  stockTemporalPipeline() {
    const query = [
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
            product_id: "$product_id",
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
          product_id: "$_id.product_id",
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
          product_id: 1,
          "date.day": 1,
          "date.month": 1,
          "date.year": 1
        }
      },
      {
        $setWindowFields: {
          partitionBy: "$product_id",
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
          into: "product-temporal-stock",
          on: ["product_id", "date"],
          whenMatched: "merge",
          whenNotMatched: "insert"
        }
      }
    ]

    return query
  }
  stockPipeline() {
    const query = [
      {
        $match: {}
      },
      {
        $group: {
          _id: "$product_id",
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
          product_id: "$_id",
          enter: 1,
          exit: 1,
          balance: {
            $subtract: ["$enter", "$exit"]
          }
        }
      },
      {
        $merge: {
          into: "product-stock",
          on: ["product_id"],
          whenMatched: "merge",
          whenNotMatched: "insert"
        }
      }
    ]

    return query
  }
}

export const updateProductStockUsacase = singleton(UpdateProductStockUsacase)
