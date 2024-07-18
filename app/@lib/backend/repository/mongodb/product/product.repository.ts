import { IProduct } from "../../../domain";
import { BaseRepository } from "../@base/base";

class ProductRepository extends BaseRepository<IProduct> {
  private static instance: ProductRepository;

  private constructor() {
    super({
      collection: "product",
      db: "bstock"
    });
  }

  public static getInstance(): ProductRepository {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository();
    }
    return ProductRepository.instance;
  }
}

export const productRepository = ProductRepository.getInstance();
