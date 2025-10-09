import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/backend/decorators";
import { IAddressRepository } from "@/backend/domain/commercial";
import { addressRepository } from "@/backend/infra";
import { IAddress } from "@/backend/domain/commercial/entity/address.definition";
class FindOneAddressUsecase {
    repository: IAddressRepository;

    constructor() {
        this.repository = addressRepository;
    }

    @RemoveMongoId()
    async execute(input: Filter<IAddress>) {
        return await this.repository.findOne(input);
    }
}

export const findOneAddressUsecase = singleton(FindOneAddressUsecase);

