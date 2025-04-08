import type { NextAuthConfig } from "next-auth";

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
          profile_id: user.profile_id,
          temporary_password: user.temporary_password,
          name: user.name,
        });
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.id);
      session.user.profile_id = token.profile_id as string[];
      session.user.temporary_password = token.temporary_password as boolean;
      session.user.name = token.name as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
