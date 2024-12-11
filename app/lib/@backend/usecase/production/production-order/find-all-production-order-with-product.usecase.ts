import {
  IProduct,
  IProductionOrder,
  IProductionOrderRepository,
  IFinancialOrder,
} from "@/app/lib/@backend/domain";
import { productionOrderRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindAllProductionOrderWithInputUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  @RemoveMongoId()
  async execute(input?: any) {
    const pipeline = this.pipeline(input);
    const aggregate = await this.repository.aggregate(pipeline);
    return (await aggregate.toArray()) as (IProductionOrder & {
      sale_order: IFinancialOrder;
      products_in_sale_order: IProduct[];
    })[];
  }

  pipeline(input?: any) {
    const match = input
      ? Object.assign(input, { active: true })
      : { active: true };
    const pipeline = [
      { $match: match },
      {
        $lookup: {
          as: "sale_order",
          from: "sale-order",
          localField: "sale_order_id",
          foreignField: "id",
        },
      },
      {
        $lookup: {
          as: "products_in_sale_order",
          from: "product",
          localField: "sale_order.products.product_id",
          foreignField: "id",
        },
      },
      {
        $project: {
          id: 1,
          created_at: 1,
          products: 1,
          stage: 1,
          code: 1,
          sale_order: { $first: "$sale_order" },
          products_in_sale_order: 1,
          production_process: 1,
        },
      },
      {
        $sort: {
          code: 1,
        },
      },
    ];
    return pipeline;
  }
}

export const findAllProductionOrderWithProductUsecase = singleton(
  FindAllProductionOrderWithInputUsecase
);
