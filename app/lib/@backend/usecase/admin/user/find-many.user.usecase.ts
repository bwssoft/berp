import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";

import { userRepository } from "@/app/lib/@backend/infra";
import { IUser, IUserRepository } from "@/app/lib/@backend/domain";
import { RemoveFields } from "@/app/lib/@backend/decorators";

class FindManyUserUsecase {
    repository: IUserRepository;

    constructor() {
        this.repository = userRepository;
    }

    @RemoveFields("_id", "password")
    async execute(
        filter: Filter<IUser> = {},
        page = 1, // ← novo
        limit = 10 // ← novo
    ) {
        // A assinatura do repositório já é findAll(filter, limit, page)
        return this.repository.findAll(filter, limit, page);
    }
}

export const findManyUserUsecase = singleton(FindManyUserUsecase);
