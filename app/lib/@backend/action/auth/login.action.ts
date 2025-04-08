"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

interface AuthResponse {
  success: boolean;
  error?: string;
}

export async function authenticate(data: {
  password: string;
  username: string;
}): Promise<AuthResponse> {
  try {
    await signIn("credentials", {
      redirect: false,
      ...data,
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

export async function logout(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/login");
}
