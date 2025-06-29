"use server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcrypt";
import { findOneUser } from "./app/lib/@backend/action/admin/user.action";
import { findOneProfile } from "./app/lib/@backend/action/admin/profile.action";

const { auth, signIn, signOut, handlers } = NextAuth({
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

        const user = await findOneUser({
          $or: [{ email: username }, { username }],
        });

        if (!user || !user.active || user.lock) return null;

        const profile = await findOneProfile({ id: user.profile[0].id });

        console.log("🚀 ~ authorize ~ profile:", profile);

        if (!profile) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch)
          return { ...user, current_profile: profile, image: null };

        return null;
      },
    }),
  ],
});
const { GET, POST } = handlers;

export { auth, signIn, signOut, GET, POST };
