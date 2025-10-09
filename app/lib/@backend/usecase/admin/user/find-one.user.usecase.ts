import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IUser } from "@/app/lib/@backend/domain/admin/entity/user.definition";
import { IUserRepository } from "@/app/lib/@backend/domain/admin/repository/user.repository.interface";
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
