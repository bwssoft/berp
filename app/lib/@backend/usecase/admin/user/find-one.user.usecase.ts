import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/backend/decorators";
import { IUser } from "@/backend/domain/admin/entity/user.definition";
import { IUserRepository } from "@/backend/domain/admin/repository/user.repository";
import { userRepository } from "@/backend/infra";

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

