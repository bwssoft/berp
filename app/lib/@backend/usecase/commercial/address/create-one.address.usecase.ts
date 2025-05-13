import { singleton } from "@/app/lib/util/singleton";
import { IAddressRepository } from "@/app/lib/@backend/domain/commercial";
import { addressRepository } from "@/app/lib/@backend/infra/repository";
import { IAddress } from "@/app/lib/@backend/domain";

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
