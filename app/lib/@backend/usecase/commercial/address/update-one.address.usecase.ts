import type { Filter } from "mongodb";

import { addressRepository } from "@/app/lib/@backend/infra/repository";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IAddress, IAddressRepository } from "@/app/lib/@backend/domain";

class UpdateOneAddressUsecase {
    repository: IAddressRepository;

    constructor() {
        this.repository = addressRepository;
    }

    @RemoveMongoId()
    async execute(filter: Filter<IAddress>, update: Partial<IAddress>) {
        console.log(
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            filter.id,
            update
        );
        return await this.repository.updateOne(filter, { $set: update });
        // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", data);
    }
}

export const updateOneAddressUsecase = singleton(UpdateOneAddressUsecase);
