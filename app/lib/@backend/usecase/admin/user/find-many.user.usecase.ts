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
    async execute(arg: Dto.Input): Promise<Dto.Output> {
        return await this.repository.findMany(
            arg.filter ?? {},
            arg.limit,
            arg.page,
            arg.sort
        );
    }
}

export const findManyUserUsecase = singleton(FindManyUserUsecase);
