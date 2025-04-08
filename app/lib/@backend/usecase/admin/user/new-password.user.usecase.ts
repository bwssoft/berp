import { singleton } from "@/app/lib/util";

import { hash } from "bcrypt";
import { randomInt } from "crypto";
import { IUserRepository } from "@/app/lib/@backend/domain";
import { userRepository } from "@/app/lib/@backend/infra";

namespace Dto {
    export type Input = { id: string; password: string };
    export type Output = {
        success: boolean;
        error?: {
            global?: string;
        };
    };
}

class NewPasswordUserUsecase {
    repository: IUserRepository;

    constructor() {
        this.repository = userRepository;
    }

    async execute(input: Dto.Input): Promise<Dto.Output> {
        const { id, password } = input;

        const salt = randomInt(10, 16);
        const hashedPassword = await hash(password, salt);

        try {
            await this.repository.updateOne(
                { id },
                { $set: { password: hashedPassword } }
            );
            return { success: true };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                error: {
                    global:
                        err instanceof Error
                            ? err.message
                            : JSON.stringify(err),
                },
            };
        }
    }
}

export const newPasswordUserUsecase = singleton(NewPasswordUserUsecase);
