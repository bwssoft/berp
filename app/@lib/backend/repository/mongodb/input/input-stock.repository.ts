import { IInputStock } from "../../../domain";
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

export const inputStockRepository = InputStockRepository.getInstance();
