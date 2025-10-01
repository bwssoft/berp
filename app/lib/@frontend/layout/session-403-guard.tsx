"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
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
        router.push("/login");
      }
    },
  });

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
