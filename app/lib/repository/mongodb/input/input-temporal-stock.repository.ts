import { ITemporalInputStock } from "../../../definition";
import { BaseRepository } from "../@base/base";

class InputTemporalStockRepository extends BaseRepository<ITemporalInputStock> {
  private static instance: InputTemporalStockRepository;

  private constructor() {
    super({
      collection: "input-temporal-stock",
      db: "bstock"
    });
  }

  public static getInstance(): InputTemporalStockRepository {
    if (!InputTemporalStockRepository.instance) {
      InputTemporalStockRepository.instance = new InputTemporalStockRepository();
    }
    return InputTemporalStockRepository.instance;
  }
}

export default InputTemporalStockRepository.getInstance();
