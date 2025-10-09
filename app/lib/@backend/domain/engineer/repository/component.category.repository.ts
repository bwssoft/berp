import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IComponentCategory } from "@/backend/domain/engineer/entity/component.category.definition";

export interface IComponentCategoryRepository
  extends IBaseRepository<IComponentCategory> {}
