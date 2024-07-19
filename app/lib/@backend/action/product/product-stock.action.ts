"use server"

import { getRange } from "@/app/lib/util"
import { IProduct } from "@/app/lib/@backend/domain"
import { productStockRepository, productTemporalStockRepository, productTransactionRepository } from "@/app/lib/@backend/repository/mongodb"



export async function updateProductStock() {
  const stockTemporalPipeline = updateStockTemporalAggregate()
  const stockPipeline = updateStockAggregate()
  const stockTemporalAggregate = await productTransactionRepository.aggregate(stockTemporalPipeline)
  const stockAggregate = await productTransactionRepository.aggregate(stockPipeline)
  await Promise.all([stockTemporalAggregate.toArray(), stockAggregate.toArray()])
  return
}

export async function findAllProductStock() {
  const pipeline = getStockAggregate()
  const aggregate = await productStockRepository.aggregate(pipeline)
  return await aggregate.toArray() as
    {
      product: IProduct
      enter: number
      exit: number
      balance: number
      unit_cost: number
      total_cost: number
    }[]
}

export async function getProductStockInsights() {
  const pipeline = getStockInsightsAggregate()
  const aggregate = await productStockRepository.aggregate(pipeline)
  return await aggregate.toArray() as
    {
      max_balance: { value: number, product: IProduct }
      min_balance: { value: number, product: IProduct }
      max_unit_cost: { value: number, product: IProduct }
      min_unit_cost: { value: number, product: IProduct }
      max_total_cost: { value: number, product: IProduct }
      min_total_cost: { value: number, product: IProduct }
      total_value: number
    }[]
}

export async function getTotalValueInProductStock(product_id: string) {
  const aggregate = await productStockRepository.aggregate([
    {
      $match: { product_id }
    },
    {
      $lookup: {
        from: "product",
        localField: "product_id",
        foreignField: "id",
        as: "product"
      }
    },
    {
      $lookup: {
        from: "input",
        localField: "product.inputs.input_id",
        foreignField: "id",
        as: "inputs"
      }
    },
    {
      $addFields: {
        cost: {
          $sum: {
            $map: {
              input: { $arrayElemAt: ["$product.inputs", 0] },
              as: "productInput",
              in: {
                $multiply: [
                  {
                    $arrayElemAt: [
                      "$inputs.price",
                      {
                        $indexOfArray: [
                          "$inputs.id",
                          "$$productInput.input_id"
                        ]
                      }
                    ]
                  },
                  "$$productInput.quantity"
                ]
              }
            }
          }
        }
      }
    },
    {
      $project: {
        product: { $first: ["$product"] },
        balance: 1,
        total_cost: { $multiply: ["$cost", "$balance"] }
      }
    }
  ])
  const [result] = await aggregate.toArray()
  return result as {
    product: IProduct
    balance: number
    total_cost: number
  }
}

export async function analyzeTemporalProductStock(product_id: string) {
  const { init, end, dates } = getRange(new Date(), 30)
  const pipeline = await productTemporalStockRepository.aggregate<{
    product: IProduct;
    stocks: {
      date: {
        day: number;
        year: number;
        month: number;
      };
      enter: number;
      exit: number;
      balance: number;
      cumulative_balance: number;
    }[];
  }>(analyzeTemporalStockAggregate(init, end, product_id))
  const result = await pipeline.toArray()
  return {
    result,
    dates
  }
}

/*
  Aggregate Helpers
*/
const updateStockAggregate = () => {
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

const updateStockTemporalAggregate = () => {
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

const getStockAggregate = (product_id?: string) => {
  const match: any = {
    $match: {}
  }
  if (product_id) {
    match.$match = {
      ...match.$match,
      product_id
    }
  }
  const pipeline = [
    match,
    {
      $lookup: {
        from: "product",
        localField: "product_id",
        foreignField: "id",
        as: "product"
      }
    },
    {
      $lookup: {
        from: "input",
        localField: "product.inputs.input_id",
        foreignField: "id",
        as: "inputs"
      }
    },
    {
      $addFields: {
        cost: {
          $sum: {
            $map: {
              input: { $arrayElemAt: ["$product.inputs", 0] },
              as: "productInput",
              in: {
                $multiply: [
                  {
                    $arrayElemAt: [
                      "$inputs.price",
                      {
                        $indexOfArray: [
                          "$inputs.id",
                          "$$productInput.input_id"
                        ]
                      }
                    ]
                  },
                  "$$productInput.quantity"
                ]
              }
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        product: { $first: ["$product"] },
        unit_cost: "$cost",
        total_cost: { $multiply: ["$cost", "$balance"] },
        enter: 1,
        exit: 1,
        balance: 1
      }
    },
    {
      $match: {
        product: { $exists: true }
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
        from: "product",
        localField: "product_id",
        foreignField: "id",
        as: "product"
      }
    },
    {
      $lookup: {
        from: "input",
        localField: "product.inputs.input_id",
        foreignField: "id",
        as: "inputs"
      }
    },
    {
      $addFields: {
        cost: {
          $sum: {
            $map: {
              input: { $arrayElemAt: ["$product.inputs", 0] },
              as: "productInput",
              in: {
                $multiply: [
                  {
                    $arrayElemAt: [
                      "$inputs.price",
                      {
                        $indexOfArray: [
                          "$inputs.id",
                          "$$productInput.input_id"
                        ]
                      }
                    ]
                  },
                  "$$productInput.quantity"
                ]
              }
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        product: { $first: ["$product"] },
        unit_cost: "$cost",
        total_cost: { $multiply: ["$cost", "$balance"] },
        balance: 1
      }
    },
    {
      $match: {
        product: { $exists: true }
      }
    },
    // Estágio para encontrar os itens com maior e menor quantidade, maior e menor valor unitário, e maior e menor valor total
    {
      $group: {
        _id: null,
        max_balance: {
          $max: {
            value: "$balance",
            product: "$$ROOT.product"
          }
        },
        min_balance: {
          $min: {
            value: "$balance",
            product: "$$ROOT.product"
          }
        },
        max_unit_cost: {
          $max: {
            value: "$cost",
            product: "$$ROOT.product"
          }
        },
        min_unit_cost: {
          $min: {
            value: "$cost",
            product: "$$ROOT.product"
          }
        },
        max_total_cost: {
          $max: {
            value: "$total_cost",
            product: "$$ROOT.product"
          }
        },
        min_total_cost: {
          $min: {
            value: "$total_cost",
            product: "$$ROOT.product"
          }
        },
        total_value: {
          $sum: "$total_cost"
        }
      }
    }
  ]
  return pipeline
}
const analyzeTemporalStockAggregate = (init: Date, end: Date, product_id: string) => {
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
        product_id,
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
        _id: "$product_id",
        stocks: {
          $push: {
            balance: "$balance",
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
        from: "product",
        localField: "_id",
        foreignField: "id",
        as: "product"
      }
    },
    {
      $project: {
        _id: 0,
        product: { $first: ["$product"] },
        stocks: "$stocks"
      }
    }
  ]
  return pipeline
}



