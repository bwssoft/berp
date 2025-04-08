import { cn } from "@/app/lib/util";
import { Inter } from "next/font/google";
import { ReactQueryClientProvider } from "../providers/QueryClientProvider";
import { Toaster } from "../ui/component";
import HolyLoader from "holy-loader";
import { auth } from "@/auth";
import { AuthProvider } from "../context";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
}

export async function Root(props: Props) {
  const { children } = props;
  const session = await auth();

  return (
    <html lang="en" className="h-full bg-gray-50">
      <ReactQueryClientProvider>
        <HolyLoader
          color="linear-gradient(to right, #FFB80E, #FF1BD4, #0FAAEC)"
          speed={250}
          easing="linear"
          showSpinner
        />
        <AuthProvider user={session?.user ?? null}>
          <body className={cn(inter.className, "h-full")}>{children}</body>
        </AuthProvider>
      </ReactQueryClientProvider>
      <Toaster />
    </html>
  );
}
