import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IControl } from "@/backend/domain/admin/entity/control.definition";

export interface IControlRepository extends IBaseRepository<IControl> {}
