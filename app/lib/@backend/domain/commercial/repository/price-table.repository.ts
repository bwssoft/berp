import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IPriceTable } from "@/backend/domain/commercial/entity/price-table.definition";

export interface IPriceTableRepository extends IBaseRepository<IPriceTable> {}
