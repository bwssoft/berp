import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IInputCategory } from "@/backend/domain/engineer/entity/input.category.definition";

export interface IInputCategoryRepository
  extends IBaseRepository<IInputCategory> {}
