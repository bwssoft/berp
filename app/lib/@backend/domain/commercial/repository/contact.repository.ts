import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IContact } from "@/backend/domain/commercial/entity/contact.definition";

export interface IContactRepository extends IBaseRepository<IContact> {}
