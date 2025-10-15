import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IAddress } from "@/backend/domain/commercial/entity/address.definition";

export interface IAddressRepository extends IBaseRepository<IAddress> {}
