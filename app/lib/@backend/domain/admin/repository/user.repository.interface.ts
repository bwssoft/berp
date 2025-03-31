import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IUser } from "../entity/user.definition";

export interface IUserRepository extends IBaseRepository<IUser> {}
