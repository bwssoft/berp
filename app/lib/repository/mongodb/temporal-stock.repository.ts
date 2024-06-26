import { ITemporalStock } from "../../definition";
import { BaseRepository } from "./@base/base";

class TemporalStockRepository extends BaseRepository<ITemporalStock> {
  private static instance: TemporalStockRepository;

  private constructor() {
    super({
      collection: "stock-temporal",
      db: "bstock"
    });
  }

  public static getInstance(): TemporalStockRepository {
    if (!TemporalStockRepository.instance) {
      TemporalStockRepository.instance = new TemporalStockRepository();
    }
    return TemporalStockRepository.instance;
  }
}

export default TemporalStockRepository.getInstance();
