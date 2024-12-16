import { IFinancialOrder, IFinancialOrderRepository, LineItem, LineItemProcessed } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";;
import { financialOrderRepository } from "@/app/lib/@backend/infra";

namespace Dto {
  interface LineItemOutput extends LineItem {
    product: { name: string }
  }

  interface LineItemProcessedOutput extends LineItemProcessed {
    enterprise: { name: string }
    items: LineItemOutput[]
  }

  export interface Output extends IFinancialOrder {
    line_items_processed: LineItemProcessedOutput[]
  }
}

class FindOneFinancialOrderUsecase {
  repository: IFinancialOrderRepository;

  constructor() {
    this.repository = financialOrderRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IFinancialOrder>) {
    const aggregate = await this.repository.aggregate<Dto.Output>(this.pipeline(input))
    const [result] = await aggregate.toArray()
    return result
  }

  pipeline(input: Filter<IFinancialOrder>) {
    return [
      { $match: { active: true, ...input } },
      {
        $unwind: "$line_items_processed" // Desestrutura o array line_items_processed
      },
      {
        $unwind: "$line_items_processed.items" // Desestrutura o array items
      },
      {
        $lookup: {
          from: "product", // Coleção de produtos
          localField:
            "line_items_processed.items.product_id",
          foreignField: "id",
          as: "product_details",
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1 // Traz apenas o campo 'name'
              }
            }
          ]
        }
      },
      {
        $addFields: {
          "line_items_processed.items.product": {
            $arrayElemAt: ["$product_details", 0]
          }
        }
      },
      {
        $lookup: {
          from: "business-enterprise", // Nova coleção
          localField:
            "line_items_processed.enterprise_id", // Campo de origem
          foreignField: "id", // Campo da coleção business-enterprise
          as: "enterprise",
          pipeline: [
            {
              $project: {
                _id: 0,
                short_name: 1 // Traz apenas o campo 'name'
              }
            }
          ]
        }
      },
      {
        $addFields: {
          "line_items_processed.enterprise": {
            $arrayElemAt: ["$enterprise", 0] // Pega o primeiro resultado
          }
        }
      },
      {
        $project: {
          product_details: 0,
          enterprise: 0 // Remove os campos temporários
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            enterprise_id:
              "$line_items_processed.enterprise_id"
          },
          items: {
            $push: {
              id: "$line_items_processed.items.id",
              total_price:
                "$line_items_processed.items.total_price",
              discount:
                "$line_items_processed.items.discount",
              negotiation_type_id:
                "$line_items_processed.items.negotiation_type_id",
              quantity:
                "$line_items_processed.items.quantity",
              unit_price:
                "$line_items_processed.items.unit_price",
              product_id:
                "$line_items_processed.items.product_id",
              product:
                "$line_items_processed.items.product"
            }
          },
          enterprise: {
            $first:
              "$line_items_processed.enterprise"
          },
          installment_quantity: {
            $first:
              "$line_items_processed.installment_quantity"
          },
          installment: {
            $first:
              "$line_items_processed.installment"
          },
          client_id: { $first: "$client_id" },
          proposal_id: { $first: "$proposal_id" },
          created_at: { $first: "$created_at" },
          active: { $first: "$active" },
          id: { $first: "$id" }
        }
      },
      {
        $group: {
          _id: "$_id._id",
          client_id: { $first: "$client_id" },
          proposal_id: { $first: "$proposal_id" },
          created_at: { $first: "$created_at" },
          line_items_processed: {
            $push: {
              enterprise_id: "$_id.enterprise_id",
              enterprise:
                "$enterprise",
              items: "$items",
              installment_quantity:
                "$installment_quantity",
              installment: "$installment"
            }
          },
          active: { $first: "$active" },
          id: { $first: "$id" }
        }
      }
    ]
  }
}

export const findOneFinancialOrderUsecase = singleton(FindOneFinancialOrderUsecase);
