import { singleton } from "@/app/lib/util/singleton";
import { IInputTransaction } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class InputTransactionRepository extends BaseRepository<IInputTransaction> {
  constructor() {
    super({
      collection: "input-transaction",
      db: "berp"
    });
  }

}

export const inputTransactionRepository = singleton(InputTransactionRepository)
