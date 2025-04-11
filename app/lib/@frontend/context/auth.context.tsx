"use client";

import React, {
  ComponentType,
  createContext,
  SVGProps,
  useCallback,
  useContext,
} from "react";
import { IProfile, IUser } from "../../@backend/domain";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { NavItem } from "../ui/component";

namespace Context {
  type User = Partial<IUser> & { current_profile: IProfile };

  export interface AuthContextType {
    user: User | undefined;
    profile: IProfile | undefined;
    changeProfile: (input: IProfile) => void;
    navigationByProfile: (input: NavigationItem[]) => NavigationItem[];
  }

  export interface NavigationItem extends NavItem {
    code: string;
    children?: NavigationItem[];
  }
}

const AuthContext = createContext<Context.AuthContextType>(
  {} as Context.AuthContextType
);

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
  const navigationByProfile = useCallback(
    (navigation: Context.NavigationItem[]): Context.NavigationItem[] => {
      return navigation.filter((n) =>
        n.children
          ? navigationByProfile(navigation)
          : data?.user.current_profile.locked_control_code.includes(n.code)
      );
    },
    [data]
  );
  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? session?.user,
        profile: data?.user?.current_profile ?? session?.user?.current_profile,
        changeProfile,
        navigationByProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
