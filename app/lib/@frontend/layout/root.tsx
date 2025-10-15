import { cn } from "@/app/lib/util";
import { Inter } from "next/font/google";
import { ReactQueryClientProvider } from "../providers/QueryClientProvider";
import { Toaster } from '@/frontend/ui/component/toaster';

import HolyLoader from "holy-loader";
import { AuthProvider } from '@/frontend/context/auth.context';

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Session403Guard } from "./session-403-guard";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
  session: Session | null;
}

export function Root(props: Props) {
  const { children, session } = props;

  return (
    <html lang="en" className="h-full">
      <ReactQueryClientProvider>
        <SessionProvider>
          <Session403Guard />
          <AuthProvider session={session}>
            <HolyLoader
              color="linear-gradient(to right, #FFB80E, #FF1BD4, #0FAAEC)"
              speed={250}
              easing="linear"
              showSpinner
            />
            <body className={cn(inter.className, "h-full")}>{children}</body>
          </AuthProvider>
        </SessionProvider>
      </ReactQueryClientProvider>
      <Toaster />
    </html>
  );
}
