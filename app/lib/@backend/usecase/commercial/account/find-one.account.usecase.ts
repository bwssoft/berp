import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IAccount, IAccountRepository } from "@/app/lib/@backend/domain";
import { accountRepository } from "@/app/lib/@backend/infra";

class FindOneAccountUsecase {
  repository: IAccountRepository;

  constructor() {
    this.repository = accountRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IAccount>) {
    return await this.repository.findOne(input);
  }
}

export const findOneAccountUsecase = singleton(FindOneAccountUsecase);
