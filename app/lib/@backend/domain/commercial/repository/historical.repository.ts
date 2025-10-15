import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IHistorical } from "@/backend/domain/commercial/entity/historical.definition";

export interface IHistoricalRepository extends IBaseRepository<IHistorical> {}
