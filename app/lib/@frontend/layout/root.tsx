import { cn } from "@/app/lib/util";
import { Inter } from "next/font/google";
import { ReactQueryClientProvider } from "../providers/QueryClientProvider";
import { Toaster } from "../ui/component";
import HolyLoader from "holy-loader";
import { AuthProvider } from "../context";
import { IProfile, IUser } from "../../@backend/domain";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
  user: (Partial<IUser> & { current_profile: IProfile }) | null;
}

export function Root(props: Props) {
  const { children, user } = props;

  return (
    <html lang="en" className="h-full bg-gray-50">
      <ReactQueryClientProvider>
        <AuthProvider user={user}>
          <HolyLoader
            color="linear-gradient(to right, #FFB80E, #FF1BD4, #0FAAEC)"
            speed={250}
            easing="linear"
            showSpinner
          />
          <body className={cn(inter.className, "h-full")}>{children}</body>
        </AuthProvider>
      </ReactQueryClientProvider>
      <Toaster />
    </html>
  );
}
