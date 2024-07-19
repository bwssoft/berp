import { singleton } from "@/app/lib/util/singleton";
import { IProductTransaction } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class ProductTransactionRepository extends BaseRepository<IProductTransaction> {
  constructor() {
    super({
      collection: "product-transaction",
      db: "bstock"
    });
  }

  async findAllWithProduct() {
    const db = await this.connect();
    return await db.collection<IProductTransaction>(this.collection).aggregate([
      { $match: {} },
      {
        $lookup: {
          as: "product",
          from: "product",
          localField: "product_id",
          foreignField: "id"
        }
      },
      {
        $project: {
          quantity: 1,
          created_at: 1,
          type: 1,
          product: { $first: "$product" },
        }
      },
      {
        $match: {
          product: { $exists: true }
        }
      }
    ]).toArray();
  }
}

export const productTransactionRepository = singleton(ProductTransactionRepository)
