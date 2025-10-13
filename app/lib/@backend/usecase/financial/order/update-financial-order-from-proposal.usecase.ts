
import { singleton } from "@/app/lib/util/singleton";
import type { IFinancialOrder } from "@/backend/domain/financial/entity/financial-order.definition";
import type { IFinancialOrderRepository } from "@/backend/domain/financial/repository/order.repository";
import { financialOrderRepository } from "@/backend/infra";
import { nanoid } from "nanoid";

class UpdateFinancialOrderFromProposalUsecase {
  repository: IFinancialOrderRepository;

  constructor() {
    this.repository = financialOrderRepository;
  }

  async execute(query: { id: string }, value: Partial<IFinancialOrder>) {
    const { line_items_processed } = value;

    line_items_processed?.forEach((line) => {
      const { items, installment_quantity, entry_amount } = line;

      if (typeof installment_quantity !== "number") {
        throw new Error("line_items_processed without installment_quantity");
      }

      const totalPrice = items.reduce(
        (sum, current) => sum + current.total_price,
        0
      );
      const installmentPrice =
        (totalPrice - (entry_amount ?? 0)) / installment_quantity;

      line.installment = Array.from({ length: installment_quantity }).map(
        (_, index) => {
          const currentDate = new Date();
          currentDate.setMonth(currentDate.getMonth() + index + 1);

          return {
            id: nanoid(),
            amount: Number(installmentPrice.toFixed(2)),
            valid_at: currentDate,
            percentage: Number((100 / installment_quantity).toFixed(2)),
            sequence: index + 1,
          };
        }
      );
    });

    return await this.repository.updateOne(query, { $set: value });
  }
}

export const updateFinancialOrderFromProposalUsecase = singleton(
  UpdateFinancialOrderFromProposalUsecase
);
