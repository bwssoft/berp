import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IProfile } from "@/backend/domain/admin/entity/profile.definition";

export interface IProfileRepository extends IBaseRepository<IProfile> {}
