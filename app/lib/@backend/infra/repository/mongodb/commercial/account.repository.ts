import { IAccount, IClient } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class AccountRepository extends BaseRepository<IAccount> {
  constructor() {
    super({
      collection: "commercial-account",
      db: "berp",
    });
  }
}

export const accountRepository = singleton(AccountRepository);
