import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IProduct } from "@/backend/domain/commercial/entity/product.definition";

export interface IProductRepository extends IBaseRepository<IProduct> {}
