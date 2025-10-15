import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IBase } from "@/backend/domain/logistic/entity/base.entity";

export interface ILogisticBaseRepository extends IBaseRepository<IBase> {}
