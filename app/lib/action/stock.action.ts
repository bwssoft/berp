"use server"

import inputTransactionRepository from "../repository/mongodb/input-transaction.repository";
import { IInput } from "../definition";
import stockRepository from "../repository/mongodb/stock.repository";
import temporalStockRepository from "../repository/mongodb/temporal-stock.repository";
import { getRange } from "@/app/util";

const _inputTransactionRepository = inputTransactionRepository
const _stockRepository = stockRepository
const _temporalStockRepository = temporalStockRepository

export async function updateStock() {
  const stockTemporalPipeline = updateStockTemporalAggregate()
  const stockPipeline = updateStockAggregate()
  const stockTemporalAggregate = await _inputTransactionRepository.aggregate(stockTemporalPipeline)
  const stockAggregate = await _inputTransactionRepository.aggregate(stockPipeline)
  await Promise.all([stockTemporalAggregate.toArray(), stockAggregate.toArray()])
  return
}

export async function findAllStock() {
  const pipeline = getStockAggregate()
  const aggregate = await _stockRepository.aggregate(pipeline)
  return await aggregate.toArray() as
    {
      input: IInput
      enter: number
      exit: number
      available_balance: number
      cumulative_price: number
    }[]
}

export async function getStockInsights() {
  const pipeline = getStockInsightsAggregate()
  const aggregate = await _stockRepository.aggregate(pipeline)
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

export async function analyzeTemporalStock(input_id: string) {
  const { init, end, dates } = getRange(new Date(), 30)
  const aggragete = await _temporalStockRepository.aggregate<{
    input: IInput
    stocks: {
      date: { day: number, month: number, year: number }
      enter: number
      exit: number
      balance: number
      available_balance: number
      cumulative_balance: number
    }[]
  }>(analyzeTemporalStockAggregate(init, end, input_id))
  const result = await aggragete.toArray()
  return {
    result,
    dates
  }
}

export async function getTotalValueInStock(input_id: string) {
  const aggregate = await _stockRepository.aggregate([
    {
      $match: { input_id }
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
        available_balance: 1,
        cumulative_price: { $multiply: [{ $arrayElemAt: ["$input.price", 0] }, "$available_balance"] }

      }
    }
  ])
  const [result] = await aggregate.toArray()
  return result as {
    input: IInput
    available_balance: number
    cumulative_price: number
  }
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
        available_balance: {
          $subtract: ["$enter", "$exit"]
        }
      }
    },
    {
      $merge: {
        into: "stock",
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
        available_balance: {
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
            $sum: "$available_balance",
            window: {
              documents: ["unbounded", "current"]
            }
          }
        }
      }
    },
    {
      $merge: {
        into: "stock-temporal",
        on: ["input_id", "date"],
        whenMatched: "merge",
        whenNotMatched: "insert"
      }
    }
  ]

  return query
}

const getStockAggregate = (input_id?: string) => {
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
        available_balance: 1,
        cumulative_price: {
          $multiply: [
            "$available_balance",
            { $arrayElemAt: ["$input.price", 0] }
          ]
        }
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
        available_balance: 1,
        cumulative_price: {
          $multiply: [
            "$available_balance",
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
          $max: {
            value: "$available_balance",
            input: "$$ROOT.input"
          }
        },
        min_balance: {
          $min: {
            value: "$available_balance",
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
const analyzeTemporalStockAggregate = (init: Date, end: Date, input_id: string) => {
  const pipeline = [
    {
      $addFields: {
        _date: {
          $dateFromParts: {
            year: "$date.year",
            month: "$date.month",
            day: "$date.day"
          }
        }
      }
    },
    {
      $match: {
        input_id,
        _date: {
          $gte: init,
          $lte: end,
        }
      }
    },
    {
      $sort: {
        "date.year": 1,
        "date.month": 1,
        "date.day": 1
      }
    },
    {
      $group: {
        _id: "$input_id",
        stocks: {
          $push: {
            available_balance: "$available_balance",
            cumulative_balance:
              "$cumulative_balance",
            enter: "$enter",
            exit: "$exit",
            date: "$date"
          }
        }
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
    {
      $project: {
        _id: 0,
        input: { $first: ["$input"] },
        stocks: "$stocks"
      }
    }
  ]
  return pipeline
}



