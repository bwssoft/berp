import { IStock } from "../../definition";
import { BaseRepository } from "./@base/base";

class StockTemporalRepository extends BaseRepository<IStock> {
  private static instance: StockTemporalRepository;

  private constructor() {
    super({
      collection: "stock-temporal",
      db: "bstock"
    });
  }

  public static getInstance(): StockTemporalRepository {
    if (!StockTemporalRepository.instance) {
      StockTemporalRepository.instance = new StockTemporalRepository();
    }
    return StockTemporalRepository.instance;
  }
}

export default StockTemporalRepository.getInstance();
