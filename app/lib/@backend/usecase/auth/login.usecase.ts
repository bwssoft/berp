import { singleton } from "@/app/lib/util";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

namespace Dto {
  export interface Input {}
  export interface Output {}
}

export class LoginUsecase {
  async execute(input: Dto.Input) {
    try {
      await signIn("credentials", {
        redirect: false,
        ...input,
      });
      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return {
              success: false,
              error: "Credenciais inválidas.",
            };
          default:
            return {
              success: false,
              error: "Erro durante o login.",
            };
        }
      }
      return {
        success: false,
        error: "Erro inesperado.",
      };
    }
  }
}

export const loginUsecase = singleton(LoginUsecase);
