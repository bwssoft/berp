"use client";

import { useEffect, useMemo, useRef } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const SESSION_ENDPOINT_PATH = "/api/auth/session";
const PROTECTED_ROUTES = ["/home", "/admin", "/engineer", "/commercial"];

function isProtectedRoute(pathname: string) {
  if (pathname === "/") return true;
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function resolveRequestUrl(input: Parameters<typeof fetch>[0]): string | null {
  if (typeof input === "string") {
    return input;
  }
  if (input instanceof URL) {
    return input.toString();
  }
  if (typeof Request !== "undefined" && input instanceof Request) {
    return input.url;
  }
  return null;
}

export function Session403Guard() {
  const pathname = usePathname() ?? "";
  const originalFetchRef = useRef<typeof fetch>();
  const patchedRef = useRef(false);
  const signOutTriggeredRef = useRef(false);

  const shouldGuard = useMemo(() => isProtectedRoute(pathname), [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!shouldGuard) {
      if (patchedRef.current && originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
      }
      patchedRef.current = false;
      originalFetchRef.current = undefined;
      signOutTriggeredRef.current = false;
      return;
    }

    if (patchedRef.current) {
      return;
    }

    const originalFetch = window.fetch;
    originalFetchRef.current = originalFetch;
    patchedRef.current = true;

    window.fetch = (async (input, init) => {
      const response = await (originalFetchRef.current as typeof fetch)(
        input,
        init
      );

      if (response.status === 403 && !signOutTriggeredRef.current) {
        const rawUrl = resolveRequestUrl(input);

        try {
          const parsedUrl = rawUrl
            ? new URL(rawUrl, window.location.origin)
            : null;

          if (parsedUrl?.pathname === SESSION_ENDPOINT_PATH) {
            signOutTriggeredRef.current = true;
            void signOut({ callbackUrl: "/login" });
          }
        } catch {
          // Swallow URL parsing errors and let the original response flow through
        }
      }

      return response;
    }) as typeof fetch;

    return () => {
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
        originalFetchRef.current = undefined;
      }
      patchedRef.current = false;
      signOutTriggeredRef.current = false;
    };
  }, [shouldGuard]);

  return null;
}
