import {
  IProductionOrder,
  IProductionOrderRepository,
  IFinancialOrderRepository,
} from "@/app/lib/@backend/domain";
import {
  productionOrderRepository,
  financialOrderRepository,
} from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";

class DeleteOneProductionOrderUsecase {
  repository: IProductionOrderRepository;
  financialOrderRepository: IFinancialOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
    this.financialOrderRepository = financialOrderRepository;
  }

  async execute(input: Partial<IProductionOrder>) {
    try {
      // finds the current production order before soft deleting, to delete also the sale order
      const currentProductionOrder = await this.repository.findOne(input);

      if (currentProductionOrder?.sale_order_id) {
        await this.financialOrderRepository.deleteOne({
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
