"use server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcrypt";
import { findOneProfile, findOneUser } from "./app/lib/@backend/action";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
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

        const user = await findOneUser({ username });

        if (!user) return null;

        const profile = await findOneProfile({ id: user.profile[0].id });

        if (!profile) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) return { ...user, current_profile: profile };

        return null;
      },
    }),
  ],
});
