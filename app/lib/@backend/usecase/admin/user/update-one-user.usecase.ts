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
        try {

        const emailExists = await this.repository.findOne({
            email: value.email,
            id: { $ne: query.id },
        });
        if (emailExists)
            return {
                success: false,
                error: { email: "Email já cadastrado para outro usuário!" },
            };

        const cpfExists = await this.repository.findOne({
            cpf: value.cpf,
            id: { $ne: query.id },
        });
        if (cpfExists)
            return {
                success: false,
                error: { cpf: "CPF já cadastrado em outro usuário!" },
            };

        const userNameExists = await this.repository.findOne({
            username: value.username,
            id: { $ne: query.id },
        });
        if (userNameExists)
            return {
                success: false,
                error: { username: "Username já cadastrado para outro usuário!" },
            };

            await this.repository.updateOne(query, { $set: value });
            return {success: true}
        } catch (error) {
            return {
                success: false,
                error: {
                    global: error instanceof Error ? error.message : JSON.stringify(error),
                }
            };
        }
    }
}

export const updateOneUserUsecase = singleton(UpdateOneUserUsecase);
