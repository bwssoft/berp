import type { Filter } from "mongodb";
import { IAccount, IAccountRepository } from "@/app/lib/@backend/domain";
import { accountRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class UpdateOneAccountUsecase {
  repository: IAccountRepository;

  constructor() {
    this.repository = accountRepository;
  }

  @RemoveMongoId()
  async execute(filter: Filter<IAccount>, update: Partial<IAccount>) {
    return await this.repository.updateOne(filter, { $set: update });
  }
}

export const updateOneAccountUsecase = singleton(UpdateOneAccountUsecase);
