import { ITemporalProductStock } from "../../../definition";
import { BaseRepository } from "../@base/base";

class ProductTemporalStockRepository extends BaseRepository<ITemporalProductStock> {
  private static instance: ProductTemporalStockRepository;

  private constructor() {
    super({
      collection: "product-temporal-stock",
      db: "bstock"
    });
  }

  public static getInstance(): ProductTemporalStockRepository {
    if (!ProductTemporalStockRepository.instance) {
      ProductTemporalStockRepository.instance = new ProductTemporalStockRepository();
    }
    return ProductTemporalStockRepository.instance;
  }
}

export default ProductTemporalStockRepository.getInstance();
