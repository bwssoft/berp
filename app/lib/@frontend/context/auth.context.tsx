"use client";

import React, { createContext, useContext } from "react";
import { IProfile, IUser } from "../../@backend/domain";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

type AuthUser = Partial<IUser> & { current_profile: IProfile };

interface AuthContextType {
  user: AuthUser | undefined;
  profile: IProfile | undefined;
  changeProfile: (input: IProfile) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) => {
  const { data, update } = useSession();
  const changeProfile = async (input: IProfile) => {
    await update({
      user: { ...data?.user, current_profile: input },
    });
  };
  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? session?.user,
        profile: data?.user?.current_profile ?? session?.user?.current_profile,
        changeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
