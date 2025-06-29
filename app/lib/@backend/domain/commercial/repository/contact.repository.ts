import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IContact } from "../entity";

export interface IContactRepository extends IBaseRepository<IContact> {}
