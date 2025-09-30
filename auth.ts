"use server";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from "next/server";
import { IProfile } from "./app/lib/@backend/domain";
import { z } from "zod";
import bcrypt from "bcrypt";
import { findOneUser } from "./app/lib/@backend/action/admin/user.action";
import { findOneProfile } from "./app/lib/@backend/action/admin/profile.action";
import { userObjectRepository } from "./app/lib/@backend/infra/repository/s3/admin/user.s3.repository";

async function getAvatarUrl(imageKey: string | undefined): Promise<string> {
  if (!imageKey) return "/avatar.webp";

  try {
    return await userObjectRepository.generateSignedUrl(imageKey);
  } catch (error) {
    console.error("Failed to generate avatar URL:", error);
    return "/avatar.webp";
  }
}

const { auth, signIn, signOut, handlers } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const protectedRoutes = ["/home", "/admin", "/engineer", "/commercial"];
      const unprotectedRoutes = ["/login", "/forget-password", "/set-password"];

      const isAuthenticated = !!auth?.user;
      const path = nextUrl.pathname;

      const isOnProtectedRoute =
        protectedRoutes.some((route) => path.startsWith(route)) || path === "/";
      const isOnUnprotectedRoute = unprotectedRoutes.some((route) =>
        path.startsWith(route)
      );

      if ((auth?.user as any)?.temporary_password) {
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

    async jwt({ user, token, trigger, session }) {
      const now = Math.floor(Date.now() / 1000);

      // If expired -> invalidate
      if (token.exp && now >= token.exp) {
        return null;
      }

      if (!token.exp) {
        token.exp = now + 24 * 60 * 60;
      }

      // determine the subject id to validate: prefer freshly provided user, fall back to token
      const subjectId =
        (user as any)?.id ?? (token as any)?.userId ?? (token as any)?.id;

      if (subjectId) {
        const dbUser = await findOneUser({ id: subjectId }).catch(() => null);

        if (!dbUser || dbUser.active === false || dbUser.lock === true) {
          return null; // invalidate token
        }
      } else {
        // no subject id available, nothing to validate
        return token;
      }

      if (user) {
        if ((user as any)?.blocked || (user as any)?.active === false) {
          return null; // force logout if blocked/inactive
        }

        token = Object.assign(token, {
          id: (user as any)?.id,
          profile: (user as any)?.profile,
          current_profile: (user as any)?.current_profile,
          temporary_password: (user as any)?.temporary_password,
          name: (user as any)?.name,
          avatarUrl: (user as any)?.image || "/avatar.webp",
          exp: now + 24 * 60 * 60,
          lastActivity: now,
        });
      }

      if (trigger === "update" && session) {
        if (
          (session.user as any)?.blocked ||
          (session.user as any)?.active === false
        ) {
          return null;
        }

        token = Object.assign(token, {
          id: (session.user as any)?.id,
          profile: (session.user as any)?.profile,
          current_profile: (session.user as any)?.current_profile,
          temporary_password: (session.user as any)?.temporary_password,
          name: (session.user as any)?.name,
          lastActivity: now,
        });
      }

      // If more than 30 minutes without activity -> logout
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
      if (!(token as any)?.id) return null as any;

      session.user.id = String((token as any).id);
      session.user.profile = (token as any).profile as {
        id: string;
        name: string;
      }[];
      session.user.temporary_password = (token as any)
        .temporary_password as boolean;
      session.user.name = (token as any).name as string;
      session.user.current_profile = (token as any).current_profile as IProfile;
      session.user.avatarUrl = (token as any).avatarUrl as string;

      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { username, password } = parsedCredentials.data;

        const user = await findOneUser({
          $or: [{ email: username }, { username }],
        });

        if (!user || !user.active || user.lock) return null;

        const profile = await findOneProfile({ id: user.profile[0].id });

        if (!profile) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          const avatarUrl = user.image?.key
            ? await getAvatarUrl(user.image.key)
            : "/avatar.webp";

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: avatarUrl,
            username: user.username,
            cpf: user.cpf,
            temporary_password: user.temporary_password,
            profile: user.profile,
            lock: user.lock,
            active: user.active,
            external: user.external,
            created_at: user.created_at,
            current_profile: profile,
          };
        }

        return null;
      },
    }),
  ],
});
const { GET: nextAuthGet, POST: nextAuthPost } = handlers;

const isSessionEndpoint = (request: NextRequest) => {
  const url = new URL(request.url);
  return url.pathname.endsWith("/api/auth/session");
};

const GET = async (request: NextRequest) => {
  const response = await nextAuthGet(request);

  if (isSessionEndpoint(request) && response.ok) {
    const clone = response.clone();

    try {
      const payload = await clone.json();

      if (payload === null) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      // ignore parse errors and return original response
    }
  }

  return response;
};

const POST = async (request: NextRequest) => {
  const response = await nextAuthPost(request);

  const redirectTarget = response.headers.get("Location");
  const isCredentialsError =
    redirectTarget?.includes("error=CredentialsSignin") ||
    redirectTarget?.includes("code=credentials");

  if (isCredentialsError) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return response;
};

export { auth, signIn, signOut, GET, POST };
