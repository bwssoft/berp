import { IProduct, IProductionOrder, IProductionOrderRepository } from "@/app/lib/@backend/domain";
import { productionOrderRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

namespace Dto {
  export interface Input extends Partial<IProductionOrder> { }
  export type Document = IProductionOrder & { product: Product, enterprise: Enterprise }
  export type Output = (IProductionOrder & { product: Product, enterprise: Enterprise })[]

  export interface Product {
    id: string
    name: string
    color: string
  }
  export interface Enterprise {
    id: string
    short_name: string
  }
}

class FindManyProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  @RemoveMongoId()
  async execute(input: Dto.Input): Promise<Dto.Output> {
    const aggregate = await this.repository.aggregate<Dto.Document>(this.pipeline(input))
    return await aggregate.toArray()
  }

  pipeline(input: Partial<IProductionOrder>) {
    return [
      {
        $match: { active: true, ...input }
      },
      {
        $lookup: {
          as: "product",
          from: "product",
          foreignField: "id",
          localField: "product_id",
          pipeline: [{ $project: { _id: 0, name: 1, color: 1 } }]
        }
      },
      {
        $lookup: {
          as: "enterprise",
          from: "business-enterprise",
          foreignField: "id",
          localField: "enterprise_id",
          pipeline: [{ $project: { _id: 0, short_name: 1 } }]
        }
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
        }
      },
    ]
  }
}

export const findManyProductionOrderUsecase = singleton(
  FindManyProductionOrderUsecase
);
