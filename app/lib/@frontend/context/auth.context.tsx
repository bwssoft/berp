"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useMemo } from "react";
import { logout } from "../../@backend/action";
import { IProfile, IUser } from "../../@backend/domain";

type AuthUser = Partial<IUser> & { current_profile: IProfile };

interface AuthContextType {
  user: AuthUser | undefined;
  profile: IProfile | undefined;
  changeProfile: (input: IProfile) => void;
  navBarItems: {
    name: string;
    onClick?: () => void;
    href?: string;
  }[];
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
  const navBarItems: any[] = useMemo(
    () => [
      {
        name: "Sair",
        onClick: () => {
          logout();
        },
      },
      {
        name: "Perfil",
        href: `/admin/user/form/view?id=${data?.user?.id}`,
      },
    ],
    [data]
  );
  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? session?.user,
        profile: data?.user?.current_profile ?? session?.user?.current_profile,
        changeProfile,
        navBarItems,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
