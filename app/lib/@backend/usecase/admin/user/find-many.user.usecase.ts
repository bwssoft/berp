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
    async execute(filter: Filter<IUser> = {}, page = 1, limit = 10) {
        return await this.repository.findMany(filter, limit, page);
    }
}

export const findManyUserUsecase = singleton(FindManyUserUsecase);
