import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IProduct, IProductTransaction } from "../entity";

export interface IProductTransactionRepository extends IBaseRepository<IProductTransaction> { }