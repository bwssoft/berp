import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Validates if the current session is still valid (not expired)
 * Returns the session if valid, null if expired or invalid
 */
export async function validateSession() {
  const session = await auth();

  if (!session) {
    return null;
  }

  // Check if session is expired
  const expiryTime = new Date(session.expires).getTime();
  const currentTime = Date.now();

  if (currentTime >= expiryTime) {
    return null;
  }

  return session;
}

/**
 * Middleware helper to check session validity in API routes
 */
export function withSessionValidation(
  handler: (request: NextRequest, session: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const session = await validateSession();

    if (!session) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 401 }
      );
    }

    return handler(request, session);
  };
}
