import { IProductStock } from "../../../domain";
import { BaseRepository } from "../@base/base";

class ProductStockRepository extends BaseRepository<IProductStock> {
  private static instance: ProductStockRepository;

  private constructor() {
    super({
      collection: "product-stock",
      db: "bstock"
    });
  }

  public static getInstance(): ProductStockRepository {
    if (!ProductStockRepository.instance) {
      ProductStockRepository.instance = new ProductStockRepository();
    }
    return ProductStockRepository.instance;
  }
}

export const productStockRepository = ProductStockRepository.getInstance();
