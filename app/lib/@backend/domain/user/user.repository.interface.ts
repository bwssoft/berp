// Repository interface of client entity

import { IBaseRepository } from "../@shared/repository/repository.interface";
import { IUser } from "./user.definition";

export interface IUserRepository extends IBaseRepository<IUser> {}
