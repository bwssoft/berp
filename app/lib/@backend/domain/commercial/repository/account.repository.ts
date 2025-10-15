import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IAccount } from "@/backend/domain/commercial/entity/account.definition";

export interface IAccountRepository extends IBaseRepository<IAccount> {}
