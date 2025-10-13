
import { singleton } from "@/app/lib/util/singleton";
import type { IFinancialOrderRepository } from "@/backend/domain/financial/repository/order.repository";
import { financialOrderRepository } from "@/backend/infra";

class DeleteFinancialOrderUsecase {
  financialOrderRepository: IFinancialOrderRepository;

  constructor() {
    this.financialOrderRepository = financialOrderRepository;
  }

  async execute(input: { proposal_id: string }) {
    const { proposal_id } = input;

    return await this.financialOrderRepository.deleteOne({
      proposal_id,
    });
  }
}

export const deleteFinancialOrderUsecase = singleton(
  DeleteFinancialOrderUsecase
);
