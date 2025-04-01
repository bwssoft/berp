import "./globals.css";
import { Root } from "./lib/@frontend/layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Root>{children}</Root>;
}
