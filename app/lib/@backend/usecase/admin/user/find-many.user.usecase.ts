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
    async execute(input: Filter<IUser>) {
        return await this.repository.findMany(input);
    }
}

export const findManyUserUsecase = singleton(FindManyUserUsecase);
