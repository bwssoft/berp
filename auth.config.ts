import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname.startsWith("/login");

      // Routes accessible by employees only
      const isAuthRoutes =
        nextUrl.pathname === "/" ||
        nextUrl.pathname.startsWith("/home") ||
        nextUrl.pathname.startsWith("/admin") ||
        nextUrl.pathname.startsWith("/engineer") ||
        nextUrl.pathname.startsWith("/commercial");

      // Redirect unauthenticated users trying to access auth routes
      if (!isAuthRoutes && !isLoggedIn) return;

      if (isAuthRoutes && !isLoggedIn && !isLoginPage) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/", nextUrl));
      }
      

      return true;
    },
    jwt({ user, token }) {
      if (user) {
        token = Object.assign(token, {
          id: user.id,
          profile_id: user.profile_id,
        });
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.id);
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;