"use server";

import { auth } from "@/auth";

/**
 * Get current user information from the session
 * @returns An object containing the current user's information
 */
export async function getCurrentUser() {
  const session = await auth();

  return {
    id: session?.user?.id || null,
    name: session?.user?.name || null,
    email: session?.user?.email || null,
  };
}
