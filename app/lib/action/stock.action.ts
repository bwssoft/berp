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

export async function getStockInsights() {
  const pipeline = getStockInsightsAggregate()
  const aggregate = await _stockRepository.aggregate(pipeline)
  return await aggregate.toArray() as
    {
      [
      key in "max_balance_item" |
      "min_balance_item" |
      "max_unit_price_item" |
      "min_unit_price_item" |
      "max_cumulative_price_item" |
      "min_cumulative_price_item"
      ]: {
        input: IInput;
        cumulative_balance: number;
        cumulative_price: number;
      }
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

const getStockInsightsAggregate = () => {
  const match: any = {
    $match: {}
  }
  const pipeline = [
    match,
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
        input: { $arrayElemAt: ["$input", 0] }
      }
    },
    // Estágio para encontrar os itens com maior e menor quantidade, maior e menor valor unitário, e maior e menor valor total
    {
      $group: {
        _id: null,
        max_balance: {
          $max: "$cumulative_balance"
        },
        min_balance: {
          $min: "$cumulative_balance"
        },
        max_unit_price: { $max: "$input.price" },
        min_unit_price: { $min: "$input.price" },
        max_cumulative_price: {
          $max: "$cumulative_price"
        },
        min_cumulative_price: {
          $min: "$cumulative_price"
        },
        items: { $push: "$$ROOT" }
      }
    },
    // Projetar os campos desejados, incluindo os itens com maior e menor quantidade, valor unitário e valor total
    {
      $project: {
        _id: 0,
        max_balance_item: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$items",
                as: "item",
                cond: {
                  $eq: [
                    "$$item.cumulative_balance",
                    "$max_balance"
                  ]
                }
              }
            },
            0
          ]
        },
        min_balance_item: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$items",
                as: "item",
                cond: {
                  $eq: [
                    "$$item.cumulative_balance",
                    "$min_balance"
                  ]
                }
              }
            },
            0
          ]
        },
        max_unit_price_item: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$items",
                as: "item",
                cond: {
                  $eq: [
                    "$$item.input.price",
                    "$max_unit_price"
                  ]
                }
              }
            },
            0
          ]
        },
        min_unit_price_item: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$items",
                as: "item",
                cond: {
                  $eq: [
                    "$$item.input.price",
                    "$min_unit_price"
                  ]
                }
              }
            },
            0
          ]
        },
        max_cumulative_price_item: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$items",
                as: "item",
                cond: {
                  $eq: [
                    "$$item.cumulative_price",
                    "$max_cumulative_price"
                  ]
                }
              }
            },
            0
          ]
        },
        min_cumulative_price_item: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$items",
                as: "item",
                cond: {
                  $eq: [
                    "$$item.cumulative_price",
                    "$min_cumulative_price"
                  ]
                }
              }
            },
            0
          ]
        },
      }
    }
  ]
  return pipeline
}




