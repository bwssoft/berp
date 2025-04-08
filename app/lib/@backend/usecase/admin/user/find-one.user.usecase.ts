import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IUser, IUserRepository } from "@/app/lib/@backend/domain";
import { userRepository } from "@/app/lib/@backend/infra";

class FindOneUserUsecase {
    repository: IUserRepository;

    constructor() {
        this.repository = userRepository;
    }

    @RemoveMongoId()
    async execute(input: Filter<IUser>) {
        return await this.repository.findOne(input);
    }
}

export const findOneUserUsecase = singleton(FindOneUserUsecase);
