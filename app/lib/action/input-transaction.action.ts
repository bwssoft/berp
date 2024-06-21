"use server"

import { getWeekRange } from "@/app/util";
import { IInput, IInputTransaction } from "../definition";
import inputTransactionRepository from "../repository/mongodb/input-transaction.repository";

const repository = inputTransactionRepository

export async function createOneInputTransaction(input: Omit<IInputTransaction, "id" | "created_at">) {
  await repository.create({ ...input, created_at: new Date(), id: crypto.randomUUID() })
  return input
}

export async function findOneInputTransaction(input: IInputTransaction) {
  return await repository.findOne(input)
}

export async function findAllInputTransactionWithInput(): Promise<(IInputTransaction & { input: IInput })[]> {
  return await repository.findAllWithInput() as (IInputTransaction & { input: IInput })[]
}

export async function resumeStockByInput(input_id?: string) {
  const { init, end, dates } = getWeekRange(new Date())
  const cumulativeAggregation = await repository.aggregate<{
    enter: number
    exit: number
    balance: number
    input: IInput
    byDay: {
      day: string
      enter: number
      exit: number
      balance: number
    }[]
  }>(stockValueByInputByDayCumulative(init, end, input_id))

  const countAggregation = await repository.aggregate<{
    transactions: number
    enter: number
    exit: number
    ratioEnterExit: number
  }>(countStockTransactions(init, end, input_id))

  const result = await Promise.all([cumulativeAggregation.toArray(), countAggregation.toArray()])

  return {
    cumulative: result[0],
    count: result[1][0],
    dates
  }
}

export async function countStockByInput(input_id?: string) {
  const { init, end, dates } = getWeekRange(new Date())
  const countAggregation = await repository.aggregate<{
    transactions: number
    enter: number
    exit: number
    ratioEnterExit: number
  }>(countStockTransactions(init, end, input_id))

  const result = await countAggregation.toArray()

  return {
    count: result,
    dates
  }
}

const stockValueByInputByDay = (init: Date, end: Date, input_id: string) => {
  const match: any = {
    $match: {
      created_at: {
        $gte: init,
        $lte: end
      }
    }
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
        _id: {
          input_id: "$input_id",
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created_at"
            }
          }
        },
        enter: {
          $sum: {
            $cond: {
              if: { $eq: ["$type", "enter"] },
              then: "$quantity",
              else: 0
            }
          }
        },
        exit: {
          $sum: {
            $cond: {
              if: { $eq: ["$type", "exit"] },
              then: "$quantity",
              else: 0
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: "input",
        localField: "_id.input_id",
        foreignField: "id",
        as: "input"
      }
    },
    {
      $project: {
        _id: 0,
        input_id: "$_id.input_id",
        day: "$_id.day",
        enter: 1,
        exit: 1,
        balance: { $subtract: ["$enter", "$exit"] },
        input: { $arrayElemAt: ["$input", 0] }
      }
    },
    {
      $sort: { day: 1 } // Opcional: Ordena por data
    },
    {
      $group: {
        _id: "$input_id",
        enter: { $sum: "$enter" },
        exit: { $sum: "$exit" },
        balance: { $sum: "$balance" },
        input: { $first: "$input" },
        byDay: {
          $push: {
            day: "$day",
            enter: "$enter",
            exit: "$exit",
            balance: "$balance"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        enter: 1,
        exit: 1,
        balance: 1,
        input: 1,
        byDay: 1
      }
    },
    {
      $sort: { "input._id": 1 } // Opcional: Ordena por data
    }
  ]
  return query
}

const stockValueByInputByDayCumulative = (init: Date, end: Date, input_id?: string) => {
  const match: any = {
    $match: {
      created_at: {
        $gte: init,
        $lte: end
      }
    }
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
        _id: {
          input_id: "$input_id",
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created_at"
            }
          }
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
      $lookup: {
        from: "input",
        localField: "_id.input_id",
        foreignField: "id",
        as: "input"
      }
    },
    {
      $project: {
        _id: 0,
        input_id: "$_id.input_id",
        day: "$_id.day",
        enter: 1,
        exit: 1,
        balance: {
          $subtract: ["$enter", "$exit"]
        },
        input: {
          $arrayElemAt: ["$input", 0]
        }
      }
    },
    {
      $sort: {
        input_id: 1,
        day: 1
      }
    },
    {
      $group: {
        _id: "$input_id",
        enter: {
          $sum: "$enter"
        },
        exit: {
          $sum: "$exit"
        },
        balance: {
          $sum: "$balance"
        },
        input: {
          $first: "$input"
        },
        byDay: {
          $push: {
            day: "$day",
            enter: "$enter",
            exit: "$exit",
            balance: "$balance"
          }
        }
      }
    },
    {
      $addFields: {
        byDay: {
          $reduce: {
            input: "$byDay",
            initialValue: { cumulativeBalance: 0, days: [] },
            in: {
              cumulativeBalance: {
                $add: ["$$value.cumulativeBalance", "$$this.balance"]
              },
              days: {
                $concatArrays: [
                  "$$value.days",
                  [
                    {
                      day: "$$this.day",
                      enter: "$$this.enter",
                      exit: "$$this.exit",
                      balance: "$$this.balance",
                      cumulativeBalance: {
                        $add: ["$$value.cumulativeBalance", "$$this.balance"]
                      }
                    }
                  ]
                ]
              }
            }
          }
        }
      }
    },
    {
      $project: {
        enter: 1,
        exit: 1,
        balance: 1,
        input: 1,
        byDay: "$byDay.days"
      }
    },
    {
      $sort: {
        "input._id": 1
      }
    }
  ]
  return query
}

const countStockTransactions = (init: Date, end: Date, input_id?: string) => {
  const match: any = {
    $match: {
      created_at: {
        $gte: init,
        $lte: end
      }
    }
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
        _id: null,
        transactions: { $sum: 1 },
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
        transactions: 1,
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

  return query
}




