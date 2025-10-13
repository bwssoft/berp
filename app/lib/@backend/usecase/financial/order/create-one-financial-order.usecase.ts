
import { singleton } from "@/app/lib/util/singleton";
import type { IFinancialOrder } from "@/backend/domain/financial/entity/financial-order.definition";
import type { IFinancialOrderRepository } from "@/backend/domain/financial/repository/order.repository";
import { financialOrderRepository } from "@/backend/infra";

class CreateOneFinancialOrderUsecase {
  repository: IFinancialOrderRepository;

  constructor() {
    this.repository = financialOrderRepository;
  }

  async execute(input: Omit<IFinancialOrder, "id" | "created_at" | "code">) {
    const lastFinancialOrder = await this.repository.findOne(
      {},
      { sort: { code: -1 }, limit: 1 }
    );

    const payload = Object.assign(input, {
      id: crypto.randomUUID(),
      created_at: new Date(),
      code: (lastFinancialOrder?.code ?? 0) + 1,
    });

    return await this.repository.create(payload);
  }
}

export const createOneFinancialOrderUsecase = singleton(
  CreateOneFinancialOrderUsecase
);
