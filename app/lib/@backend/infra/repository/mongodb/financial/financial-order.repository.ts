import { singleton } from "@/app/lib/util/singleton";
import { IFinancialOrder } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";

class FinancialOrderRepository extends BaseRepository<IFinancialOrder> {
  constructor() {
    super({
      collection: "sale-order",
      db: "berp"
    });
  }

}

export const financialOrderRepository = singleton(FinancialOrderRepository)
