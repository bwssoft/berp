import { DefaultSession, DefaultUser } from "next-auth";
 
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      email: string;
      created_at: Date;
      id: string;
      profile_id: string[];
    };
  }
 
  interface User {
    email: string;
    created_at: Date;
    id: string;
    profile_id: string[];
  }
}