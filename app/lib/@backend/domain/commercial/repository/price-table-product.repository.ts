import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IPriceTableProduct } from "../entity/price-table-product.definition";

export interface IPriceTableProductRepository extends IBaseRepository<IPriceTableProduct> {}
