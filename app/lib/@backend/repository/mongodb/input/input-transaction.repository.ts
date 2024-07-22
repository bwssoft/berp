import { singleton } from "@/app/lib/util/singleton";
import { IInput, IInputTransaction } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class InputTransactionRepository extends BaseRepository<IInputTransaction> {
  constructor() {
    super({
      collection: "input-transaction",
      db: "berp"
    });
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
    ]).toArray() as (IInputTransaction & { input: IInput })[]
  }
}

export const inputTransactionRepository = singleton(InputTransactionRepository)
