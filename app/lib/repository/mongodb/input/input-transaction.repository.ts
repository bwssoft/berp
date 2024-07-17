import { IInputTransaction } from "../../../definition";
import { BaseRepository } from "../@base/base";

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

  async findAllWithInput() {
    const db = await this.connect();
    return await db.collection<IInputTransaction>(this.collection).aggregate([
      { $match: {} },
      {
        $lookup: {
          as: "input",
          from: "input",
          localField: "input_id",
          foreignField: "id"
        }
      },
      {
        $project: {
          quantity: 1,
          created_at: 1,
          type: 1,
          input: { $first: "$input" },
        }
      },
      {
        $match: {
          input: { $exists: true }
        }
      },
    ]).toArray();
  }
}

export default InputTransactionRepository.getInstance();
