import { singleton } from "@/app/lib/util/singleton";
import { IProduct, IProductTransaction } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class ProductTransactionRepository extends BaseRepository<IProductTransaction> {
  constructor() {
    super({
      collection: "product-transaction",
      db: "berp"
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
    ]).toArray() as (IProductTransaction & { product: IProduct })[]
  }
}

export const productTransactionRepository = singleton(ProductTransactionRepository)
