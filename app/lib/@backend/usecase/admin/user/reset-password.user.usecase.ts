import { singleton } from "@/app/lib/util/singleton";
import { generateRandomPassword } from "@/app/lib/util/generate-random-password";
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";
import { hash } from "bcrypt";
import { randomInt } from "crypto";
import { IBMessageGateway } from "../../../domain/@shared/gateway/bmessage.gateway.interface";
import { bmessageGateway } from "../../../infra/gateway/bmessage/bmessage.gateway";
import { formatResetPasswordEmail } from "@/app/lib/util/format-template-reset-passwor-email";

export namespace Dto {
    export type Input = {
        id: string;
    };

    export type Output = {
        success: boolean;
        error?: string;
    };
}

class ResetPasswordUserUsecase {
    private repository: IUserRepository;
    private bmessageGateway: IBMessageGateway;

    constructor() {
        this.repository = userRepository;
        this.bmessageGateway = bmessageGateway;
    }

    async execute(input: Dto.Input): Promise<Dto.Output> {
        const { id } = input;

        try {
            const user = await this.repository.findOne({ id });

            if (!user) {
                return { success: false, error: "Usuário não encontrado." };
            }

            const temporaryPassword = generateRandomPassword();
            const salt = randomInt(10, 16);
            const hashedPassword = await hash(temporaryPassword, salt);

            await this.repository.updateOne(
                { id },
                { $set: { password: hashedPassword } }
            );

            const html = await formatResetPasswordEmail({
                name: user.name,
                username: user.username,
                password: temporaryPassword,
            });

            await this.bmessageGateway.html({
                to: user.email,
                subject: "BCube – Reset de senha",
                html,
                attachments: [],
            });

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : JSON.stringify(err),
            };
        }
    }
}

export const resetPasswordUserUsecase = singleton(ResetPasswordUserUsecase);
