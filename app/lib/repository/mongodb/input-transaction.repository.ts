import { IInputTransaction } from "../../definition";
import { BaseRepository } from "./@base/base";

class InputTransactionRepository extends BaseRepository<IInputTransaction> {
  private static instance: InputTransactionRepository;

  private constructor() {
    super({
      collection: "input-transaction",
      db: "bstock"
    });
  }

  public static getInstance(): InputTransactionRepository {
    if (!InputTransactionRepository.instance) {
      InputTransactionRepository.instance = new InputTransactionRepository();
    }
    return InputTransactionRepository.instance;
  }
}

export default InputTransactionRepository.getInstance();
