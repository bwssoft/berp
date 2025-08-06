"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

export function useSessionExpiry() {
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set up expiry check if user is authenticated
    if (status === "authenticated" && session?.expires) {
      const expiryTime = new Date(session.expires).getTime();
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      // If token is already expired or will expire soon, sign out immediately
      if (timeUntilExpiry <= 0) {
        signOut({ callbackUrl: "/login" });
        return;
      }

      // Set timeout to sign out when token expires
      timeoutRef.current = setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, timeUntilExpiry);
    }

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [status, session?.expires]);

  // Check session validity on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (status === "authenticated" && session?.expires) {
        const expiryTime = new Date(session.expires).getTime();
        const currentTime = Date.now();

        if (currentTime >= expiryTime) {
          signOut({ callbackUrl: "/login" });
        }
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [status, session?.expires]);
}
