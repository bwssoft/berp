import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { Filter } from "mongodb";
import { IAddressRepository } from "@/backend/domain/commercial";
import { addressRepository } from "@/backend/infra";
import { IAddress } from "@/backend/domain/commercial/entity/address.definition";

class FindManyAddressUsecase {
    repository: IAddressRepository;

    constructor() {
        this.repository = addressRepository;
    }

    @RemoveMongoId()
    async execute(input: Filter<IAddress>) {
        const { docs } = await this.repository.findMany(input);
        return docs;
    }
}

export const findManyAddressUsecase = singleton(FindManyAddressUsecase);

