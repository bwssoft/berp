import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IProduct } from "../entity";

export interface IProductRepository extends IBaseRepository<IProduct> { }