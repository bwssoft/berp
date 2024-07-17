import { IProductTransaction } from "../../../definition";
import { BaseRepository } from "../@base/base";

class ProductTransactionRepository extends BaseRepository<IProductTransaction> {
  private static instance: ProductTransactionRepository;

  private constructor() {
    super({
      collection: "product-transaction",
      db: "bstock"
    });
  }

  public static getInstance(): ProductTransactionRepository {
    if (!ProductTransactionRepository.instance) {
      ProductTransactionRepository.instance = new ProductTransactionRepository();
    }
    return ProductTransactionRepository.instance;
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

export default ProductTransactionRepository.getInstance();
