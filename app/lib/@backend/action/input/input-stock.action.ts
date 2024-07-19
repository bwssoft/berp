"use server"

import { analyzeTemporalInputStockUsecase, findAllInputStockUsecase, getInputStockInsightUsecase, getTotalValueInputStockUsecase, updateInputStockUsacase } from "../../usecase"


export async function updateInputStock() {
  await updateInputStockUsacase.execute()
}

export async function findAllInputStock() {
  return await findAllInputStockUsecase.execute()
}

export async function getInputStockInsight() {
  return await getInputStockInsightUsecase.execute()
}

export async function getTotalValueInInputStock(input_id: string) {
  return await getTotalValueInputStockUsecase.execute(input_id)
}

export async function analyzeTemporalInputStock(input_id: string) {
  return await analyzeTemporalInputStockUsecase.execute(input_id)
}

/*
  Aggregate Helpers
*/
const updateStockAggregate = (input_id?: string) => {
  const match: any = {
    $match: {}
  }
  if (input_id) {
    match.$match = {
      ...match.$match,
      input_id
    }
  }
  const query = [
    match,
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
  return query
}
const updateStockTemporalAggregate = (input_id?: string) => {
  const match: any = {
    $match: {}
  }
  if (input_id) {
    match.$match = {
      ...match.$match,
      input_id
    }
  }
  const query = [
    match,
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

  return query
}



