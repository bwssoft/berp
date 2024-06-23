import { IStock } from "../../definition";
import { BaseRepository } from "./@base/base";

class StockRepository extends BaseRepository<IStock> {
  private static instance: StockRepository;

  private constructor() {
    super({
      collection: "stock",
      db: "bstock"
    });
  }

  public static getInstance(): StockRepository {
    if (!StockRepository.instance) {
      StockRepository.instance = new StockRepository();
    }
    return StockRepository.instance;
  }
}

export default StockRepository.getInstance();
