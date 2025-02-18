"use client";

import { usePathname } from "next/navigation";
import { Layout, Toaster } from "@/app/lib/@frontend/ui/component";
import HolyLoader from "holy-loader";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const withSideBar = !pathname.startsWith("/crm");

  return (
    <Layout withSideBar={withSideBar}>
      <HolyLoader
        color="linear-gradient(to right, #FFB80E, #FF1BD4, #0FAAEC)"
        speed={250}
        easing="linear"
        showSpinner
      />
      {children}
      <Toaster />
    </Layout>
  );
}
