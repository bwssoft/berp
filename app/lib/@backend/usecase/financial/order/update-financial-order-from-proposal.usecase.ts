import { singleton } from "@/app/lib/util/singleton"
import { IFinancialOrder } from "@/app/lib/@backend/domain/financial/entity/financial-order.definition";
import { IFinancialOrderRepository } from "@/app/lib/@backend/domain/financial/repository/financial-order.repository.interface";
import { financialOrderRepository } from "@/app/lib/@backend/infra"
import { nanoid } from "nanoid"

class UpdateFinancialOrderFromProposalUsecase {
  repository: IFinancialOrderRepository

  constructor() {
    this.repository = financialOrderRepository
  }

  async execute(query: { id: string }, value: Partial<IFinancialOrder>) {
    const { line_items_processed } = value
    line_items_processed?.forEach(line => {
      const { items, installment_quantity, entry_amount } = line
      if (typeof installment_quantity !== "number") {
        throw new Error("line_items_processed without installment_quantity")
      }
      const total_price = items.reduce((acc, cur) => acc + cur.total_price, 0)
      const installment_price = (total_price - (entry_amount ?? 0)) / installment_quantity
      line["installment"] = Array.from({ length: installment_quantity }).map((_, index) => {
        const current_date = new Date();
        current_date.setMonth(current_date.getMonth() + index + 1)
        return {
          id: nanoid(),
          amount: Number(installment_price.toFixed(2)),
          valid_at: current_date,
          percentage: Number((100 / installment_quantity).toFixed(2)),
          sequence: index + 1,
        }
      })
    })
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateFinancialOrderFromProposalUsecase = singleton(UpdateFinancialOrderFromProposalUsecase)
