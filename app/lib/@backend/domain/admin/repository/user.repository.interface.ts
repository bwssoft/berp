import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IUser } from "@/backend/domain/admin/entity/user.definition";

export interface IUserRepository extends IBaseRepository<IUser> {}
