import IProduct from "@/app/lib/@backend/domain/commercial/entity/product.definition";
import ITechnology from "@/app/lib/@backend/domain/engineer/entity/technology.definition";
import { productionOrderRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IEnterprise } from "../../../domain/business/entity/enterprise.entity";

namespace Dto {
  export interface Input extends Partial<IProductionOrder> {}

  export type Document = IProductionOrder & {
    enterprise: Pick<IEnterprise, "id" | "name">;
    product: Pick<
      IProduct,
      "id" | "name" | "created_at" | "color" | "description"
    > & {
      technology: Pick<ITechnology, "name" | "id">;
      category: Pick<IProductCategory, "name" | "id">;
      bom: {
        input_id: string;
        quantity: number;
        input_name: string;
      }[];
    };
  };

  export type Output =
    | (IProductionOrder & {
        product: Product;
        enterprise: Pick<IEnterprise, "id" | "name">;
      })
    | undefined;

  export interface Product {
    id: string;
    name: string;
    color: string;
    description?: string;
    created_at: Date;
    technology: Pick<ITechnology, "name" | "id">;
    category: Pick<IProductCategory, "name" | "id">;
    bom: {
      input_id: string;
      quantity: number;
      input_name: string;
    }[];
  }
}

class FindOneProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    const aggregate = await this.repository.aggregate<Dto.Document>(
      this.pipeline(arg)
    );
    const [production_order] = await aggregate.toArray();

    if (!production_order) return undefined;

    return production_order;
  }

  pipeline(input: Partial<IProductionOrder>) {
    return [
      {
        $match: { active: true, ...input },
      },
      {
        $lookup: {
          as: "enterprise",
          from: "business.enterprise",
          foreignField: "id",
          localField: "enterprise_id",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                name: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          as: "product",
          from: "product",
          foreignField: "id",
          localField: "product_id",
          pipeline: [
            {
              $lookup: {
                as: "technology",
                from: "engineer-technology",
                foreignField: "id",
                localField: "technology_id",
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      id: 1,
                      name: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                as: "category",
                from: "product-category",
                foreignField: "id",
                localField: "category_id",
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      id: 1,
                      name: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$bom",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "input",
                localField: "bom.input_id",
                foreignField: "id",
                as: "bom_input",
              },
            },
            {
              $unwind: {
                path: "$bom_input",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                technology_id: 1,
                technology: { $first: "$technology" },
                category: { $first: "$category" },
                bom: 1,
                process_execution: 1,
                color: 1,
                description: 1,
                created_at: 1,
                bom_input: 1,
              },
            },
            {
              $group: {
                _id: "$id",
                name: { $first: "$name" },
                category_id: {
                  $first: "$category_id",
                },
                technology: { $first: "$technology" },
                category: { $first: "$category" },
                bom: {
                  $push: {
                    input_id: "$bom.input_id",
                    quantity: "$bom.quantity",
                    input_name: "$bom_input.name",
                  },
                },
                process_execution: {
                  $first: "$process_execution",
                },
                color: { $first: "$color" },
                description: {
                  $first: "$description",
                },
                created_at: { $first: "$created_at" },
              },
            },
          ],
        },
      },
      {
        $project: {
          product: { $first: "$product" },
          enterprise: { $first: "$enterprise" },
          id: 1,
          client_id: 1,
          proposal_id: 1,
          financial_order_id: 1,
          description: 1,
          line_items: 1,
          product_id: 1,
          total_quantity: 1,
          code: 1,
          stage: 1,
          priority: 1,
          created_at: 1,
        },
      },
    ];
  }
}

export const findOneProductionOrderUsecase = singleton(
  FindOneProductionOrderUsecase
);
