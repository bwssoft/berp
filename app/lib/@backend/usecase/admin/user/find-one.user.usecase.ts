import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";
import { IUser } from "../../../domain/admin/entity/user.definition";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

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
