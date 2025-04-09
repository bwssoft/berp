"use client";

import React, { createContext, useContext } from "react";
import { IProfile, IUser } from "../../@backend/domain";
import { useSession } from "next-auth/react";

type AuthUser = Partial<IUser> & { current_profile: IProfile };

interface AuthContextType {
  user: AuthUser | null;
  profile: IProfile | undefined;
  changeProfile: (input: IProfile) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) => {
  const { data: session, update } = useSession();
  const changeProfile = async (input: IProfile) => {
    await update({
      user: { ...session?.user, current_profile: input },
    });
  };
  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? user,
        profile: session?.user.current_profile ?? user?.current_profile,
        changeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
