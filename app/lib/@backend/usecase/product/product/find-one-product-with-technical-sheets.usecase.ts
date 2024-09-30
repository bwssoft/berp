import { IProductRepository } from "@/app/lib/@backend/domain";
import { productRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { IProductWithTechnicalSheet } from "./dto/product-with-technical-sheet.dto";

class FindOneProductWithTechnicalSheetsUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  async execute(
    input: Partial<IProductWithTechnicalSheet>
  ): Promise<IProductWithTechnicalSheet> {
    const pipeline = this.pipeline(input);
    const aggregate = await this.repository.aggregate(pipeline);

    const [mongoDocument] = await aggregate.toArray();

    return mongoDocument as IProductWithTechnicalSheet;
  }

  pipeline(input: Partial<IProductWithTechnicalSheet>) {
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

export const findOneProductWithTechnicalSheetsUsecase = singleton(
  FindOneProductWithTechnicalSheetsUsecase
);
