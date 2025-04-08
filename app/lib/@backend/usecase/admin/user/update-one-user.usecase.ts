import { singleton } from "@/app/lib/util/singleton";
import { IUser, IUserRepository } from "@/app/lib/@backend/domain";
import { userRepository } from "@/app/lib/@backend/infra";

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
