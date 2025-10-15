import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IClient } from "@/backend/domain/commercial/entity/client.definition";

export interface IClientRepository extends IBaseRepository<IClient> { }
