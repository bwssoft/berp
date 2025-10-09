import { IProductionOrderRepository } from "@/backend/domain/production/repository/production-order.repository";
import { productionOrderRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";

class UpdateOneProductionOrderLineItemUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  async execute(
    query: { id: string; line_item_id: string },
    value: { configuration_profile_id: string | null }
  ) {
    const { configuration_profile_id } = value;
    return await this.repository.updateOne(
      { id: query.id, "line_items.id": query.line_item_id },
      {
        $set: {
          "line_items.$.configuration_profile_id": configuration_profile_id,
        },
      }
    );
  }
}

export const updateOneProductionOrderLineItemUsecase = singleton(
  UpdateOneProductionOrderLineItemUsecase
);

