"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import { loginUsecase } from "../../usecase";

export async function authenticate(data: {
  password: string;
  username: string;
}) {
  return await loginUsecase.execute(data);
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/login");
}
