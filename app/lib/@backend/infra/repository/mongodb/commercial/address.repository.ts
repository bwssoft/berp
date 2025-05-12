import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";
import { IAddress } from "@/app/lib/@backend/domain";

class AddressRepository extends BaseRepository<IAddress> {
    constructor() {
        super({
            collection: "commercial.address",
            db: "berp",
        });
    }
}

export const addressRepository = singleton(AddressRepository);
