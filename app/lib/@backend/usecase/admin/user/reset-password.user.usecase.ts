import { singleton } from "@/app/lib/util/singleton";
import { generateRandomPassword } from "@/app/lib/util/generateRandomPassword";
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";
import { hash } from "bcrypt";
import { randomInt } from "crypto";
import { IBMessageGateway } from "../../../domain/@shared/gateway/bmessage.gateway.interface";
import { bmessageGateway } from "../../../infra/gateway/bmessage/bmessage.gateway";

export namespace Dto {
    export type Input = {
        id: string;
    };

    export type Output = {
        ok: boolean;
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
                return { ok: false };
            }

            const temporaryPassword = generateRandomPassword();
            const salt = randomInt(10, 16);
            const hashedPassword = await hash(temporaryPassword, salt);

            await this.repository.updateOne(
                { id },
                { $set: { password: hashedPassword } }
            );

            await this.bmessageGateway.html({
                to: user.email,
                subject: "Redefinição de Senha",
                html: `Sua nova senha é: ${temporaryPassword}`,
                attachments: [],
            });

            return { ok: true };
        } catch (err) {
            console.error("Erro ao redefinir senha:", err);
            return { ok: false };
        }
    }
}

export const resetPasswordUserUsecase = singleton(ResetPasswordUserUsecase);
