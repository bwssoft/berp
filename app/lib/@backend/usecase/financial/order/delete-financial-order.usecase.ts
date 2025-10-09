import { singleton } from "@/app/lib/util/singleton";
import { IFinancialOrderRepository } from "@/app/lib/@backend/domain/financial/repository/financial-order.repository.interface";
import { financialOrderRepository } from "@/app/lib/@backend/infra";

class DeleteFinancialOrderUsecase {
  financialOrderRepository: IFinancialOrderRepository;

  constructor() {
    this.financialOrderRepository = financialOrderRepository
  }

  async execute(input: {
    proposal_id: string,
  }) {
    const { proposal_id } = input
    try {
      await this.financialOrderRepository.deleteOne(
        {
          proposal_id: proposal_id,
        }
      )
    } catch (err) {
      throw err;
    }
  }

}

export const deleteFinancialOrderUsecase = singleton(
  DeleteFinancialOrderUsecase
);