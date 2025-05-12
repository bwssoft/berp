import { singleton } from "@/app/lib/util/singleton";
import { IAddress } from "../../../domain";
import { IAddressRepository } from "../../../domain/commercial/repository/address.repository";
import { addressRepository } from "../../../infra/repository/mongodb/commercial/address.repository";

class CreateOneAddressUsecase {
    repository: IAddressRepository;

    constructor() {
        this.repository = addressRepository;
    }

    async execute(input: Omit<IAddress, "id" | "created_at" | "updated_at">) {
        const address = {
            ...input,
            id: crypto.randomUUID(),
            created_at: new Date(),
        };
        return await this.repository.create(address);
    }
}

export const createOneAddressUsecase = singleton(CreateOneAddressUsecase);
