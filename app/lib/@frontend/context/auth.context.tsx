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

// Extended types to include avatarUrl
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
  refreshAvatarUrl: () => Promise<void>; // Added method to refresh avatar URL
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

      // Import locally to avoid circular dependencies
      const { findOneProfile } = await import(
        "@/app/lib/@backend/action/admin/profile.action"
      );

      // Get the latest profile data
      const profileId = data.user.current_profile.id;
      console.log("Refreshing profile with ID:", profileId);
      const updatedProfile = await findOneProfile({ id: profileId });

      if (!updatedProfile) {
        console.error("Failed to refresh profile: Profile not found");
        return false;
      }

      // Log the updated profile permissions for debugging
      console.log(
        "Updated profile permissions:",
        updatedProfile.locked_control_code
      );

      // Update the session with fresh profile data
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
        user.current_profile.locked_control_code.includes(el.code)
      );
    },
    [data]
  );

  const restrictFeatureByProfile = useCallback(
    (code: string) => {
      if (!data) return false;
      const { user } = data;
      return user.current_profile.locked_control_code.includes(code);
    },
    [data]
  );

  const refreshAvatarUrl = async () => {
    try {
      const response = await fetch("/api/auth/refresh-avatar");
      if (!response.ok) throw new Error("Failed to refresh avatar");

      const data = await response.json();

      setAvatarUrl(data.avatarUrl);

      await update({
        user: {
          avatarUrl: data.avatarUrl,
        },
      });
    } catch (error) {
      console.error("Error refreshing avatar:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? session?.user,
        profile: data?.user?.current_profile ?? session?.user?.current_profile,
        avatarUrl,
        changeProfile,
        refreshCurrentProfile,
        refreshAvatarUrl,
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
