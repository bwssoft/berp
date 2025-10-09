import type { IProduct } from "@/backend/domain/commercial/entity/product.definition";
import type { IProductionOrder } from "@/backend/domain/production/entity/production-order.definition";
import type { IProductionOrderRepository } from "@/backend/domain/production/repository/production-order.repository";
import { productionOrderRepository } from "@/backend/infra";
import { RemoveMongoId } from "@/backend/decorators";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IProductionOrder> {}
  export type Document = IProductionOrder & {
    product: Product;
    enterprise: Enterprise;
    technology: Technology;
  };
  export type Output = (IProductionOrder & {
    product: Product;
    technology: Technology;
    enterprise: Enterprise;
  })[];

  export interface Product {
    id: string;
    name: string;
    color: string;
  }
  export interface Technology {
    id: string;
    name: { brand: string };
  }
  export interface Enterprise {
    id: string;
    name: { short: string; fantasy: string; legal: string };
  }
}

class FindManyProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  @RemoveMongoId()
  async execute(input: Dto.Input): Promise<Dto.Output> {
    const aggregate = await this.repository.aggregate<Dto.Document>(
      this.pipeline(input)
    );
    return await aggregate.toArray();
  }

  pipeline(input: Filter<IProductionOrder>) {
    return [
      {
        $match: { active: true, ...input },
      },
      {
        $lookup: {
          as: "product",
          from: "product",
          foreignField: "id",
          localField: "product_id",
          pipeline: [
            { $project: { _id: 0, name: 1, color: 1, technology_id: 1 } },
          ],
        },
      },
      {
        $lookup: {
          as: "technology",
          from: "engineer-technology",
          foreignField: "id",
          localField: "product.technology_id",
          pipeline: [{ $project: { _id: 0, name: 1, id: 1 } }],
        },
      },
      {
        $lookup: {
          as: "enterprise",
          from: "business.enterprise",
          foreignField: "id",
          localField: "enterprise_id",
          pipeline: [{ $project: { _id: 0, name: 1 } }],
        },
      },
      {
        $project: {
          technology: { $first: "$technology" },
          product: { $first: "$product" },
          enterprise: { $first: "$enterprise" },
          id: 1,
          client_id: 1,
          proposal: 1,
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

export const findManyProductionOrderUsecase = singleton(
  FindManyProductionOrderUsecase
);
