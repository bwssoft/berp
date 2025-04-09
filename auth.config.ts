import type { NextAuthConfig } from "next-auth";
import { IProfile } from "./app/lib/@backend/domain";

const protectRoutes = ["/home", "/admin", "/engineer", "/commercial"];
const unprotectRoutes = ["/login", "/forget-password", "/set-password"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      const isOnProtectRoute =
        protectRoutes.some((r) => path.startsWith(r)) || path === "/";
      const isOnUnprotectRoute = unprotectRoutes.some((r) =>
        path.startsWith(r)
      );

      if (isOnUnprotectRoute) return true;
      if (isOnProtectRoute) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ user, token }) {
      if (user) {
        token = Object.assign(token, {
          id: user.id,
          profile: user.profile,
          current_profile: user.current_profile,
          temporary_password: user.temporary_password,
          name: user.name,
        });
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.id);
      session.user.profile = token.profile as { id: string; name: string }[];
      session.user.temporary_password = token.temporary_password as boolean;
      session.user.name = token.name as string;
      session.user.current_profile = token.current_profile as IProfile;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
