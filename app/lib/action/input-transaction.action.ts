"use server"

import { getRange } from "@/app/util";
import { IInput, IInputTransaction } from "../definition";
import inputTransactionRepository from "../repository/mongodb/input-transaction.repository";

const repository = inputTransactionRepository

export async function createOneInputTransaction(input: Omit<IInputTransaction, "id" | "created_at">) {
  await repository.create({ ...input, created_at: new Date(), id: crypto.randomUUID() })
  return input
}

export async function findAllInputTransactionWithInput(): Promise<(IInputTransaction & { input: IInput })[]> {
  return await repository.findAllWithInput() as (IInputTransaction & { input: IInput })[]
}

export async function resumeInputTransactions() {
  const { init, end, dates } = getRange(new Date(), 15)
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
      cumulative_balance: number
    }[]
  }>(stockValueByInputByDayCumulative(init, end))

  const countAggregation = await repository.aggregate<{
    total: number
    enter: number
    exit: number
    ratioEnterExit: number
  }>(countInputTransactionAggregate({ init, end }))

  const result = await Promise.all([cumulativeAggregation.toArray(), countAggregation.toArray()])

  return {
    cumulative: result[0],
    count: result[1][0] ?? { total: 0, enter: 0, exit: 0, ratioEnterExit: 0 },
    dates
  }
}

export async function countInputTransaction(input_id?: string) {
  const countAggregation = await repository.aggregate<{
    total: number
    enter: number
    exit: number
    ratioEnterExit: number
  }>(countInputTransactionAggregate(undefined, input_id))

  const [result] = await countAggregation.toArray()

  return result
}

const stockValueByInputByDayCumulative = (init: Date, end: Date) => {
  const query = [
    {
      $match: {
        created_at: {
          $gte: init,
          $lte: end
        }
      }
    },
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
          $first: "$input"
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
            initialValue: { cumulative_balance: 0, days: [] },
            in: {
              cumulative_balance: {
                $add: ["$$value.cumulative_balance", "$$this.balance"]
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
                      cumulative_balance: {
                        $add: ["$$value.cumulative_balance", "$$this.balance"]
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

const countInputTransactionAggregate = (date?: { init: Date, end: Date }, input_id?: string) => {
  const match: any = {}

  if (input_id) {
    match.$match = {
      ...match.$match,
      input_id
    }
  }
  if (date) {
    match.$match = {
      ...match.$match,
      created_at: {
        $gte: date.init,
        $lte: date.init
      }
    }
  }
  const query = [
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

  return query
}




