import { auth } from "@/auth";
import "./globals.css";
import { Root } from "./lib/@frontend/layout";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return <Root session={session}>{children}</Root>;
}
