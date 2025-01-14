import {
  IInput,
  IProduct,
  IProductionOrder,
  IProductionOrderRepository,
} from "@/app/lib/@backend/domain";
import { productionOrderRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IEnterprise } from "../../../domain/business/entity/enterprise.entity";

namespace Dto {
  export interface Input extends Partial<IProductionOrder> { }
  export type Document = IProductionOrder & {
    enterprise: Pick<IEnterprise, "id" | "short_name">,
    product: Pick<IProduct, "id" | "name" | "bom" | "process_execution" | "created_at" | "color" | "description">,
    input: Pick<IInput, "id" | "name">[]
  }
  export type Output = IProductionOrder & { product: Product, enterprise: Pick<IEnterprise, "id" | "short_name"> } | undefined
  export interface Product {
    id: string
    name: string
    color: string
    description: string
    created_at: Date
    process_execution?: IProduct["process_execution"]
    bom?: {
      input: {
        id: string
        name: string
      }
      quantity: number
    }[]
  }
}

class FindOneProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    const aggregate = await this.repository.aggregate<Dto.Document>(this.pipeline(arg))
    const [production_order] = await aggregate.toArray()

    if (!production_order) return undefined

    const { input: input_array, product, ...rest } = production_order

    const transformedProduct: Dto.Product = {
      id: product.id,
      name: product.name,
      description: product.description,
      color: product.color,
      created_at: product.created_at,
      process_execution: product.process_execution,
      bom: product?.bom?.map((bomItem) => {
        const matchedInput = input_array.find((inp) => inp.id === bomItem.input_id);
        if (!matchedInput) return undefined
        return {
          input: {
            id: bomItem.input_id,
            name: matchedInput?.name!,
          },
          quantity: bomItem.quantity
        };
      }).filter((el): el is NonNullable<typeof el> => el !== undefined)
    };

    return {
      ...rest,
      product: transformedProduct
    }
  }

  pipeline(input: Partial<IProductionOrder>) {
    return [
      {
        $match: { active: true, ...input }
      },
      {
        $lookup: {
          as: "enterprise",
          from: "business-enterprise",
          foreignField: "id",
          localField: "enterprise_id",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                short_name: 1,
              }
            }
          ]
        }
      },
      {
        $lookup: {
          as: "product",
          from: "product",
          foreignField: "id",
          localField: "product_id",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                name: 1,
                bom: 1,
                process_execution: 1,
                color: 1,
                description: 1,
                created_at: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          as: "input",
          from: "input",
          foreignField: "id",
          localField: "product.bom.input_id",
          pipeline: [
            {
              $project: { _id: 0, id: 1, name: 1 }
            }
          ]
        }
      },
      {
        $project: {
          product: { $first: "$product" },
          enterprise: { $first: "$enterprise" },
          input: 1,
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
      }
    ]
  }
}

export const findOneProductionOrderUsecase = singleton(
  FindOneProductionOrderUsecase
);
