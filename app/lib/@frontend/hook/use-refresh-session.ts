"use client";

import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";
import { findOneProfile } from "../../@backend/action/admin/profile.action";

/**
 * A custom hook to refresh the user session with updated profile data without reloading the page
 * This is useful when profile permissions are updated and need to be reflected immediately
 */
export function useRefreshSession() {
  const { data, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to refresh the current session with the latest profile data
  const refreshSession = useCallback(async () => {
    if (!data?.user?.current_profile?.id) return false;

    try {
      setIsRefreshing(true);
      const profileId = data.user.current_profile.id;

      // Get the latest profile data
      const updatedProfile = await findOneProfile({ id: profileId });

      if (!updatedProfile) {
        console.error("Failed to fetch updated profile");
        return false;
      }

      // Update the session with fresh profile data
      await update({
        user: {
          ...data.user,
          current_profile: updatedProfile,
        },
      });

      console.log("Session updated successfully with fresh profile data");
      return true;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [data, update]);

  return { refreshSession, isRefreshing };
}
