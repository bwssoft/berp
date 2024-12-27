import { singleton } from "@/app/lib/util/singleton"
import { IFinancialOrder, IFinancialOrderRepository } from "@/app/lib/@backend/domain"
import { financialOrderRepository } from "@/app/lib/@backend/infra"

class CreateOneFinancialOrderUsecase {
  repository: IFinancialOrderRepository

  constructor() {
    this.repository = financialOrderRepository
  }

  async execute(input: Omit<IFinancialOrder, "id" | "created_at" | "code">) {
    const last_financial_order = await this.repository.findOne({}, {sort: {code: -1}, limit: 1})

    const _input = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
      code: (last_financial_order?.code ?? 0) + 1
    })

    return await this.repository.create(_input)
  }
}

export const createOneFinancialOrderUsecase = singleton(CreateOneFinancialOrderUsecase)
