import { singleton } from "@/app/lib/util/singleton"
import { IFinancialOrder, IFinancialOrderRepository } from "@/app/lib/@backend/domain"
import { financialOrderRepository } from "@/app/lib/@backend/infra"
import { nanoid } from "nanoid"

class UpdateFinancialOrderFromProposalUsecase {
  repository: IFinancialOrderRepository

  constructor() {
    this.repository = financialOrderRepository
  }

  async execute(query: { id: string }, value: Partial<IFinancialOrder>) {
    const { line_items_processed } = value
    line_items_processed?.map(line => {
      const { items, installment_quantity } = line
      if (typeof installment_quantity !== "number") {
        throw new Error("line_items_processed without installment_quantity")
      }
      const total_price = items.reduce((acc, cur) => acc + (cur.unit_price * cur.quantity), 0)
      const installment_price = total_price / installment_quantity
      line["installment"] = Array.from({ length: installment_quantity }).map((_, index) => {
        const current_date = new Date();
        current_date.setMonth(current_date.getMonth() + index + 1)
        return {
          id: nanoid(),
          value: installment_price,
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
