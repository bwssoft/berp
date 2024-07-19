"use server"

import { IProduct, IProductTransaction } from "@/app/lib/@backend/domain";
import { productTransactionRepository } from "@/app/lib/@backend/repository/mongodb";

const repository = productTransactionRepository

export async function createOneProductTransaction(product: Omit<IProductTransaction, "id" | "created_at">) {
  await repository.create({ ...product, created_at: new Date(), id: crypto.randomUUID() })
  return product
}

export async function findAllProductTransactionWithProduct(): Promise<(IProductTransaction & { product: IProduct })[]> {
  return await repository.findAllWithProduct() as (IProductTransaction & { product: IProduct })[]
}

export async function countProductTransaction(product_id?: string) {
  const countAggregation = await repository.aggregate<{
    total: number
    enter: number
    exit: number
    ratioEnterExit: number
  }>(countProductTransactionAggregate(undefined, product_id))

  const [result] = await countAggregation.toArray()

  return result
}

const countProductTransactionAggregate = (date?: { init: Date, end: Date }, product_id?: string) => {
  const match: any = {}

  if (product_id) {
    match.$match = {
      ...match.$match,
      product_id
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




