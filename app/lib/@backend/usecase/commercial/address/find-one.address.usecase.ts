import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IAddressRepository } from "@/app/lib/@backend/domain/commercial";
import { addressRepository } from "@/app/lib/@backend/infra/repository";
import { IAddress } from "@/app/lib/@backend/domain";
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
