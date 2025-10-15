import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { ISector } from "@/backend/domain/commercial/entity/sector.definition";

export interface ISectorRepository extends IBaseRepository<ISector> {}
