"use client";

import React, { createContext, useContext } from "react";
import { IUser } from "../../@backend/domain";

interface AuthContextType {
  user: Partial<IUser> | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({
  user,
  children,
}: {
  user: Partial<IUser> | null;
  children: React.ReactNode;
}) => {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
