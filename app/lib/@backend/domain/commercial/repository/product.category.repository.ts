import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IProductCategory } from "@/backend/domain/commercial/entity/product.category.definition";

export interface IProductCategoryRepository
  extends IBaseRepository<IProductCategory> {}
