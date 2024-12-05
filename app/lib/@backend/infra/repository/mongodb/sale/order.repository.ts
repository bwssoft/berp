import { singleton } from "@/app/lib/util/singleton";
import { ISaleOrder } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";

class SaleOrderRepository extends BaseRepository<ISaleOrder> {
  constructor() {
    super({
      collection: "sale-order",
      db: "berp"
    });
  }

}

export const saleOrderRepository = singleton(SaleOrderRepository)
