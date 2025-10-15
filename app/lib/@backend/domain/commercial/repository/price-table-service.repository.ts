import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IPriceTableService } from "@/backend/domain/commercial/entity/price-table-service.definition";

export interface IPriceTableServiceRepository
  extends IBaseRepository<IPriceTableService> {}
