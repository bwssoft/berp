"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { IProfile, IUser } from "../../@backend/domain";
import { logout } from "../../@backend/action/auth/login.action";
import { useSessionExpiry } from "../hook/use-session-expiry";

type AuthUser = Partial<IUser> & {
  current_profile: IProfile;
  avatarUrl?: string;
};

type RedirectOption<T> = T & { code: string };

interface AuthContextType {
  user: AuthUser | undefined;
  profile: IProfile | undefined;
  avatarUrl: string;
  changeProfile: (input: IProfile) => void;
  refreshCurrentProfile: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  navBarItems: {
    name: string;
    onClick?: () => void;
    href?: string;
  }[];
  navigationByProfile: <T>(options: RedirectOption<T>[]) => RedirectOption<T>[];
  restrictFeatureByProfile: (code: string) => boolean;
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

  // Initialize session expiry monitoring
  useSessionExpiry();

  const [avatarUrl, setAvatarUrl] = useState(
    data?.user?.avatarUrl || session?.user?.avatarUrl || "/avatar.webp"
  );

  useEffect(() => {
    setAvatarUrl(
      data?.user?.avatarUrl || session?.user?.avatarUrl || "/avatar.webp"
    );
  }, [data?.user?.avatarUrl, session?.user?.avatarUrl]);

  const changeProfile = async (input: IProfile) => {
    await update({
      user: { ...data?.user, current_profile: input },
    });
  };

  const refreshCurrentProfile = async (): Promise<boolean> => {
    try {
      if (!data?.user?.current_profile?.id) {
        console.warn("Cannot refresh profile: No current profile in session");
        return false;
      }

      const { findOneProfile } = await import(
        "@/app/lib/@backend/action/admin/profile.action"
      );

      const profileId = data.user.current_profile.id;
      const updatedProfile = await findOneProfile({ id: profileId });

      if (!updatedProfile) {
        console.error("Failed to refresh profile: Profile not found");
        return false;
      }

      await update({
        user: {
          ...data.user,
          current_profile: updatedProfile,
        },
      });

      console.log("Profile refreshed successfully");
      return true;
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      return false;
    }
  };
  const refreshUserData = async (): Promise<void> => {
    try {
      if (!data?.user?.id) {
        console.warn("Cannot refresh user data: No user ID in session");
        return;
      }

      const { findOneUser, getUserAvatarUrl } = await import(
        "@/app/lib/@backend/action/admin/user.action"
      );

      const userId = data.user.id;

      const updatedUser = await findOneUser({ id: userId });

      if (!updatedUser) {
        console.error("Failed to refresh user data: User not found");
        return;
      }

      const newAvatarUrl = await getUserAvatarUrl(userId);

      setAvatarUrl(newAvatarUrl);

      await update({
        user: {
          ...data.user,
          ...updatedUser,
          avatarUrl: newAvatarUrl,
        },
      });
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
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
  ) => RedirectOption<T>[] = useCallback(
    (options) => {
      if (!data) return [];
      const { user } = data;
      return options.filter((el) =>
        user.current_profile?.locked_control_code.includes(el.code)
      );
    },
    [data]
  );

  const restrictFeatureByProfile = useCallback(
    (code: string) => {
      if (!data) return false;
      const { user } = data;
      return user.current_profile?.locked_control_code.includes(code);
    },
    [data]
  );

  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? session?.user,
        profile: data?.user?.current_profile ?? session?.user?.current_profile,
        avatarUrl,
        changeProfile,
        refreshCurrentProfile,
        refreshUserData,
        navBarItems,
        navigationByProfile,
        restrictFeatureByProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
