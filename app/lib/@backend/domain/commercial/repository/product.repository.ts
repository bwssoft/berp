import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IProduct } from "../entity/product.definition";

export interface IProductRepository extends IBaseRepository<IProduct> {}
