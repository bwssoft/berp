import {
  IProductionOrder,
  IProductionOrderRepository,
  ISaleOrderRepository,
} from "@/app/lib/@backend/domain";
import {
  productionOrderRepository,
  saleOrderRepository,
} from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class DeleteOneProductionOrderUsecase {
  repository: IProductionOrderRepository;
  saleOrderRepository: ISaleOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
    this.saleOrderRepository = saleOrderRepository;
  }

  async execute(input: Partial<IProductionOrder>) {
    try {
      // finds the current production order before soft deleting, to delete also the sale order
      const currentProductionOrder = await this.repository.findOne(input);

      if (currentProductionOrder?.sale_order_id) {
        await this.saleOrderRepository.deleteOne({
          id: currentProductionOrder.sale_order_id,
        });
      }

      await this.repository.deleteOne(input);
    } catch (error) {
      console.log(error);
      throw new Error(
        "Error in DeleteOneProductionOrderUsecase, execute method"
      );
    }
  }
}

export const deleteOneProductionOrderUsecase = singleton(
  DeleteOneProductionOrderUsecase
);
