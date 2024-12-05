import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductTemporalStockRepository } from "@/app/lib/@backend/domain"
import { productTemporalStockRepository } from "@/app/lib/@backend/infra"
import { getRange } from "@/app/lib/util"

class AnalyzeTemporalProductStockUsecase {
  repository: IProductTemporalStockRepository

  constructor() {
    this.repository = productTemporalStockRepository
  }

  async execute(product_id: string) {
    const { init, end, dates } = getRange(new Date(), 30)
    const pipeline = this.pipeline(init, end, product_id)
    const aggregate = await this.repository.aggregate<{
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
    }>(pipeline)
    const result = await aggregate.toArray()
    return {
      result,
      dates
    }
  }

  pipeline(init: Date, end: Date, product_id: string) {
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
}

export const analyzeTemporalProductStockUsecase = singleton(AnalyzeTemporalProductStockUsecase)
