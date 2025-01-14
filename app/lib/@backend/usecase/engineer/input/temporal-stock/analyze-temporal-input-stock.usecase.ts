import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputTemporalStockRepository } from "@/app/lib/@backend/domain"
import { inputTemporalStockRepository } from "@/app/lib/@backend/infra"
import { getRange } from "@/app/lib/util"

class AnalyzeTemporalInputStockUsecase {
  repository: IInputTemporalStockRepository

  constructor() {
    this.repository = inputTemporalStockRepository
  }

  async execute(input_id: string) {
    const { init, end, dates } = getRange(new Date(), 30)
    const pipeline = this.pipeline(init, end, input_id)
    const aggregate = await this.repository.aggregate<{
      input: IInput;
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

  pipeline(init: Date, end: Date, input_id: string) {
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
}

export const analyzeTemporalInputStockUsecase = singleton(AnalyzeTemporalInputStockUsecase)
