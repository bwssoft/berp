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

        if (!isOnSetPassword) {
          return NextResponse.redirect(
            new URL("/set-password", nextUrl.origin)
          );
        }

        return true;
      }

      if (isOnUnprotectedRoute) return true;
      if (isOnProtectedRoute) return isAuthenticated;

      return true;
    },

    jwt({ user, token, trigger, session }) {
      const now = Math.floor(Date.now() / 1000);

      // Se expirou -> invalida
      if (token.exp && now >= token.exp) {
        return null;
      }

      if (!token.exp) {
        token.exp = now + 24 * 60 * 60;
      }

      if (user) {
        if (user.lock || user.active === false) {
          return null; // força logout se bloqueado/inativo
        }

        token = Object.assign(token, {
          id: user.id,
          profile: user.profile,
          current_profile: user.current_profile,
          temporary_password: user.temporary_password,
          name: user.name,
          avatarUrl: user.image || "/avatar.webp",
          exp: now + 24 * 60 * 60,
          lastActivity: now,
        });
      }

      if (trigger === "update" && session) {
        if (session.user.blocked || session.user.active === false) {
          return null;
        }

        token = Object.assign(token, {
          id: session.user.id,
          profile: session.user.profile,
          current_profile: session.user.current_profile,
          temporary_password: session.user.temporary_password,
          name: session.user.name,
          lastActivity: now,
        });
      }

      // Se passou 30 min sem atividade -> desloga
      if (
        token.lastActivity &&
        now - (token.lastActivity as number) > 30 * 60
      ) {
        return null;
      }

      token.lastActivity = now;

      return token;
    },

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
  providers: [],
} satisfies NextAuthConfig;
