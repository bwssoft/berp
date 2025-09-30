"use server";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
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
  ...authConfig,
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
  providers: [
    Credentials({
      async authorize(credentials) {
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
            image: avatarUrl, // Use the image field for the avatar URL
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
  callbacks: {
    async jwt({ token }) {
      if (token?.id) {
        const dbUser = await findOneUser({ id: token.id });

        if (!dbUser || !dbUser.active || dbUser.lock) {
          token.active = false;
        } else {
          token.active = true;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.active = token.active as boolean;
      }

      if (session.user?.active === false) {
        session.expires = new Date(0).toISOString() as any;
      }

      return session;
    },
  },
});
const { GET, POST } = handlers;

export { auth, signIn, signOut, GET, POST };
