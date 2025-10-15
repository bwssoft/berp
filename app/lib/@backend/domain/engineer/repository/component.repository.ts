import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IComponent } from "@/backend/domain/engineer/entity/component.definition";

export interface IComponentRepository extends IBaseRepository<IComponent> {}
