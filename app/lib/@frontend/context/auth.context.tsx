"use client";

import React, { createContext, useContext, useState } from "react";
import { IProfile, IUser } from "../../@backend/domain";

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
  const [profile, setProfile] = useState<IProfile | undefined>(
    user?.current_profile
  );
  const changeProfile = (input: IProfile) => setProfile(input);
  return (
    <AuthContext.Provider value={{ user, profile, changeProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
