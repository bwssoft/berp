"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, useCallback, useContext, useMemo } from "react";
import { logout } from "../../@backend/action";
import { IProfile, IUser } from "../../@backend/domain";

type AuthUser = Partial<IUser> & { current_profile: IProfile };
type RedirectOption<T> = T & { code: string };

interface AuthContextType {
  user: AuthUser | undefined;
  profile: IProfile | undefined;
  changeProfile: (input: IProfile) => void;
  navBarItems: {
    name: string;
    onClick?: () => void;
    href?: string;
  }[];
  navigationByProfile: <T>(options: RedirectOption<T>[]) => RedirectOption<T>[];
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
  const navigationByProfile: <T>(
    options: RedirectOption<T>[]
  ) => RedirectOption<T>[] = (options) => {
    if (!data) return [];
    const { user } = data;
    return options.filter(
      (el) => !user.current_profile.locked_control_code.includes(el.code)
    );
  };
  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? session?.user,
        profile: data?.user?.current_profile ?? session?.user?.current_profile,
        changeProfile,
        navBarItems,
        navigationByProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
