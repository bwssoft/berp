import { singleton } from "@/app/lib/util/singleton";
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";
import { IUser } from "../../../domain/admin/entity/user.definition";

class UpdateOneUserUsecase {
    repository: IUserRepository;

    constructor() {
        this.repository = userRepository;
    }

    async execute(
        query: { id: string },
        value: Partial<Omit<IUser, "id" | "created_at">>
    ) {
        return await this.repository.updateOne(query, { $set: value });
    }
}

export const updateOneUserUsecase = singleton(UpdateOneUserUsecase);
