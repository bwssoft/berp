"use client";

import { useEffect, useRef } from "react";
import { getSession, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PROTECTED_ROUTES = ["/", "/home", "/admin", "/engineer", "/commercial"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function Session403Guard() {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession({
    required: false,
    onUnauthenticated() {
      if (pathname && isProtectedRoute(pathname)) {
        router.replace("/login");
      }
    },
  });

  const isCheckingRef = useRef(false);

  useEffect(() => {
    if (!pathname || !isProtectedRoute(pathname)) {
      return;
    }

    let cancelled = false;

    const verifySession = async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      try {
        const session = await getSession();

        if (!session && !cancelled) {
          router.replace("/login");
        }
      } catch (error) {
        if (!cancelled) {
          router.replace("/login");
        }
      } finally {
        isCheckingRef.current = false;
      }
    };

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  useEffect(() => {
    if (!pathname || !isProtectedRoute(pathname)) {
      return;
    }

    if (status === "unauthenticated") {
      signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    }
  }, [status, pathname, router]);

  return null;
}
