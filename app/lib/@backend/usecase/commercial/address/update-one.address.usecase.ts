import type { Filter } from "mongodb";

import { addressRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { IAddress } from "@/backend/domain/commercial/entity/address.definition";
import { IAddressRepository } from "@/backend/domain/commercial/repository/address.repository";

class UpdateOneAddressUsecase {
    repository: IAddressRepository;

    constructor() {
        this.repository = addressRepository;
    }

    @RemoveMongoId()
    async execute(filter: Filter<IAddress>, update: Partial<IAddress>) {
        return await this.repository.updateOne(filter, { $set: update });
    }
}

export const updateOneAddressUsecase = singleton(UpdateOneAddressUsecase);

