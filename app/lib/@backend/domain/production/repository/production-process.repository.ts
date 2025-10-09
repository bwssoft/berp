import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IProductionProcess } from "@/backend/domain/production/entity/production-process.definition";

export interface IProductionProcessRepository extends IBaseRepository<IProductionProcess> {}
