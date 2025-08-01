import { cn } from "@/app/lib/util";
import { Inter } from "next/font/google";
import { ReactQueryClientProvider } from "../providers/QueryClientProvider";
import { Toaster } from "../ui/component";
import HolyLoader from "holy-loader";
import { AuthProvider } from "../context";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

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
