import type { NextAuthConfig } from "next-auth";
import { IProfile } from "./app/lib/@backend/domain";
import { NextResponse } from "next/server";

// Definição das rotas protegidas e não protegidas
const protectedRoutes = ["/home", "/admin", "/engineer", "/commercial"];
const unprotectedRoutes = ["/login", "/forget-password", "/set-password"];

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
  callbacks: {
    // Callback para autorização: determina se o usuário pode acessar uma rota específica
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = !!auth?.user;
      const path = nextUrl.pathname;

      const isOnProtectedRoute =
        protectedRoutes.some((route) => path.startsWith(route)) || path === "/";
      const isOnUnprotectedRoute = unprotectedRoutes.some((route) =>
        path.startsWith(route)
      );

      if (auth?.user?.temporary_password) {
        const isOnSetPassword = path.startsWith("/set-password");

        // Se não está no /set-password, redireciona
        if (!isOnSetPassword) {
          return NextResponse.redirect(
            new URL("/set-password", nextUrl.origin)
          );
        }

        return true;
      }

      // Permite acesso livre em rotas não protegidas
      if (isOnUnprotectedRoute) return true;
      // Em rotas protegidas, só permite acesso se o usuário estiver autenticado
      if (isOnProtectedRoute) return isAuthenticated;

      // Permite acesso por padrão se não se encaixar nos casos acima
      return true;
    },
    // Callback para manipulação do token JWT
    jwt({ user, token, trigger, session }) {
      // Check if token is expired (24 hours = 86400 seconds)
      const now = Math.floor(Date.now() / 1000);
      if (token.exp && now >= token.exp) {
        return null; // Force token invalidation
      }

      // Set token expiration time if not already set
      if (!token.exp) {
        token.exp = now + 24 * 60 * 60; // 24 hours from now
      }

      // Caso a autenticação inicial tenha ocorrido, atualiza o token com os dados do usuário
      if (user) {
        token = Object.assign(token, {
          id: user.id,
          profile: user.profile,
          current_profile: user.current_profile,
          temporary_password: user.temporary_password,
          name: user.name,
          avatarUrl: user.image || "/avatar.webp",
          exp: now + 24 * 60 * 60, // Reset expiration on new login (24 hours)
        });
      }
      // Caso o token esteja sendo atualizado via trigger ("update") e haja dados de sessão,
      // atualiza os campos necessários do token diretamente
      if (trigger === "update" && session) {
        token = Object.assign(token, {
          id: session.user.id,
          profile: session.user.profile,
          current_profile: session.user.current_profile,
          temporary_password: session.user.temporary_password,
          name: session.user.name,
        });
      }
      return token;
    },
    // Callback para formatação da sessão enviada ao client
    session({ session, token }) {
      session.user.id = String(token.id);
      session.user.profile = token.profile as { id: string; name: string }[];
      session.user.temporary_password = token.temporary_password as boolean;
      session.user.name = token.name as string;
      session.user.current_profile = token.current_profile as IProfile;
      session.user.avatarUrl = token.avatarUrl as string;

      return session;
    },
  },
  // Caso você precise adicionar providers, coloque-os aqui
  providers: [],
} satisfies NextAuthConfig;
