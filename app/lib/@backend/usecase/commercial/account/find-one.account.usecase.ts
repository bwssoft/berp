import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/backend/decorators";
import { IAccount } from "@/backend/domain/commercial/entity/account.definition";
import { IAccountRepository } from "@/backend/domain/commercial/repository/account.repository";
import { accountRepository } from "@/backend/infra";

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

