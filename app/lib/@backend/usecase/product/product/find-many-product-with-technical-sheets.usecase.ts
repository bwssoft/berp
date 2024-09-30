import {
  IInput,
  IProduct,
  IProductRepository,
  ITechnicalSheet,
} from "@/app/lib/@backend/domain";
import { productRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";

export type IProductWithTechnicalSheet = IProduct & {
  technical_sheets: ITechnicalSheet[];
  inputs: IInput[];
};

class FindManyProductWithTechnicalSheetsUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  async execute(
    input: Filter<IProduct>
  ): Promise<IProductWithTechnicalSheet[]> {
    const pipeline = this.pipeline(input);
    const aggregate = await this.repository.aggregate(pipeline);
    return (await aggregate.toArray()) as IProductWithTechnicalSheet[];
  }

  pipeline(input: Filter<IProduct>) {
    return [
      { $match: input },
      {
        $lookup: {
          from: "technical-sheet",
          foreignField: "id",
          localField: "technical_sheet_id",
          as: "technical_sheets",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          color: 1,
          created_at: 1,
          id: 1,
          technical_sheets: 1,
          omie_code_metadata: 1,
          input_id: {
            $reduce: {
              input: "$technical_sheets",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $map: {
                      input: "$$this.inputs",
                      as: "input",
                      in: "$$input.uuid",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "input",
          localField: "input_id",
          foreignField: "id",
          as: "inputs",
        },
      },
      {
        $project: {
          input_id: 0,
        },
      },
    ];
  }
}

export const findManyProductWithTechnicalSheetsUsecase = singleton(
  FindManyProductWithTechnicalSheetsUsecase
);
