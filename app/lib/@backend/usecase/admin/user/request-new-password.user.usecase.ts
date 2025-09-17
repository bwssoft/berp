import { IUserRepository } from "@/app/lib/@backend/domain";
import { userRepository } from "@/app/lib/@backend/infra";
import { resetPasswordUserUsecase } from "./reset-password.user.usecase";

namespace Dto {
    export type Input = { email: string };
    export type Output = { success: boolean; error?: string };
}

class RequestNewPasswordUserUsecase {
    private repository: IUserRepository;

    constructor() {
        this.repository = userRepository;
    }

    async execute(input: Dto.Input): Promise<Dto.Output> {
        const { email } = input;

        try {
            const user = await this.repository.findOne({ email });

            if (!user) {
                return { success: false, error: "Usuário não encontrado." };
            }

            if (user.lock || !user.active) {
                return { success: false, error: "Não foi possível realizar esta solicitação, entre em contato com o administrador do sistema!" };
            }

            const result = await resetPasswordUserUsecase.execute({ id: user.id });
            if (!result.success) {
                return { success: false, error: result.error ? (typeof result.error === 'string' ? result.error : JSON.stringify(result.error)) : "Erro ao resetar a senha." };
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : JSON.stringify(error),
            };
        }
    }
}

export const requestNewPasswordUserUsecase =
    new RequestNewPasswordUserUsecase();
