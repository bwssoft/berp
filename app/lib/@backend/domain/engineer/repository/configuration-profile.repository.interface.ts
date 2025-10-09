import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IConfigurationProfile } from "@/backend/domain/engineer/entity/configuration-profile.definition";

export interface IConfigurationProfileRepository extends IBaseRepository<IConfigurationProfile> { }
