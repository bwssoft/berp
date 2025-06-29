import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IProductCategory } from "../entity/product.category.definition";

export interface IProductCategoryRepository
  extends IBaseRepository<IProductCategory> {}
