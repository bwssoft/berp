"use server"

import { IInput, IInputTransaction } from "../../domain";
import { inputTransactionRepository } from "../../repository/mongodb";

const repository = inputTransactionRepository

export async function createOneInputTransaction(input: Omit<IInputTransaction, "id" | "created_at">) {
  await repository.create({ ...input, created_at: new Date(), id: crypto.randomUUID() })
  return input
}

export async function findAllInputTransactionWithInput(): Promise<(IInputTransaction & { input: IInput })[]> {
  return await repository.findAllWithInput() as (IInputTransaction & { input: IInput })[]
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




