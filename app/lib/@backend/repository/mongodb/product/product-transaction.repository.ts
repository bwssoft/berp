import { singleton } from "@/app/lib/util/singleton";
import { IProductTransaction } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class ProductTransactionRepository extends BaseRepository<IProductTransaction> {
  constructor() {
    super({
      collection: "product-transaction",
      db: "berp"
    });
  }
}

export const productTransactionRepository = singleton(ProductTransactionRepository)
