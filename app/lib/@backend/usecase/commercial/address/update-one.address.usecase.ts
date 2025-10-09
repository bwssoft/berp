import type { Filter } from "mongodb";

import { addressRepository } from "@/app/lib/@backend/infra/repository";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IAddress } from "@/app/lib/@backend/domain/commercial/entity/address.definition";
import { IAddressRepository } from "@/app/lib/@backend/domain/commercial/repository/address.repository";

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
