import { IInputStock } from "../../../definition";
import { BaseRepository } from "../@base/base";

class InputStockRepository extends BaseRepository<IInputStock> {
  private static instance: InputStockRepository;

  private constructor() {
    super({
      collection: "input-stock",
      db: "bstock"
    });
  }

  public static getInstance(): InputStockRepository {
    if (!InputStockRepository.instance) {
      InputStockRepository.instance = new InputStockRepository();
    }
    return InputStockRepository.instance;
  }
}

export default InputStockRepository.getInstance();
