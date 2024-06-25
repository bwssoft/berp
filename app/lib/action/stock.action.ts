"use server"

import { getWeekRange } from "@/app/util";
import inputTransactionRepository from "../repository/mongodb/input-transaction.repository";
import { IInput } from "../definition";
import stockRepository from "../repository/mongodb/stock.repository";

const repository = inputTransactionRepository
const _stockRepository = stockRepository

export async function updateStock() {
  const pipeline = updateStockAggregate()
  const aggregate = await repository.aggregate(pipeline)
  await aggregate.toArray()
  return
}

export async function getMostRecentStock() {
  const pipeline = getMostRecentStockAggregate()
  const aggregate = await _stockRepository.aggregate(pipeline)
  return await aggregate.toArray() as
    {
      input: IInput;
      cumulative_balance: number;
      cumulative_price: number;
    }[]
}

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
      $addFields: {
        day: {
          $dayOfMonth: "$created_at"
        },
        year: {
          $year: "$created_at"
        },
        month: {
          $month: "$created_at"
        },
        week: {
          $week: {
            $dateFromParts: {
              year: {
                $year: "$created_at"
              },
              month: {
                $month: "$created_at"
              },
              day: {
                $dayOfMonth: "$created_at"
              }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: {
          input_id: "$input_id",
          year: "$year",
          month: "$month",
          week: "$week",
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
        year: "$_id.year",
        month: "$_id.month",
        week: "$_id.week",
        day: "$_id.day",
        enter: 1,
        exit: 1,
        balance: { $subtract: ["$enter", "$exit"] },
        updated_at: new Date()
      }
    },
    {
      $sort: {
        input_id: 1,
        year: 1,
        month: 1,
        week: 1,
        day: 1
      }
    },
    {
      $setWindowFields: {
        partitionBy: "$input_id",
        sortBy: {
          year: 1,
          month: 1,
          week: 1,
          day: 1
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
        into: "stock",
        on: ["input_id", "day", "week", "month", "year"],
        whenMatched: "merge",
        whenNotMatched: "insert"
      }
    }
  ]

  return query
}

const getMostRecentStockAggregate = (input_id?: string) => {
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
    // Ordena os documentos por input_id, year, month, day em ordem decrescente
    {
      $sort: {
        input_id: 1,
        year: -1,
        month: -1,
        day: -1
      }
    },
    // Agrupa os documentos por input_id, pegando o documento mais recente (primeiro)
    {
      $group: {
        _id: "$input_id",
        most_recent: { $first: "$$ROOT" }
      }
    },
    {
      $lookup: {
        from: "input",
        localField: "_id",
        foreignField: "id",
        as: "input"
      }
    },
    // Projetar os campos desejados
    {
      $project: {
        _id: 0,
        cumulative_balance:
          "$most_recent.cumulative_balance",
        cumulative_price: {
          $multiply: [
            "$most_recent.cumulative_balance",
            { $arrayElemAt: ["$input.price", 0] }
          ]
        },
        input: { $first: ["$input"] },
        year: "$most_recent.year",
        month: "$most_recent.month",
        day: "$most_recent.day",
        week: "$most_recent.week"
      }
    }
  ]
  return pipeline
}




