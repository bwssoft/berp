import { DefaultSession, DefaultUser } from "next-auth";
import { IProfile } from "./app/lib/@backend/domain";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      email: string;
      created_at: Date;
      id: string;
      name: string;
      profile: { id: string; name: string }[];
      current_profile: IProfile;
      temporary_password: boolean;
      image?: { key: string };
    };
  }

  interface User extends DefaultUser {
    email: string;
    created_at: Date;
    id: string;
    name: string;
    profile: { id: string; name: string }[];
    current_profile: IProfile;
    temporary_password: boolean;
    image?: { key: string };
  }
}
