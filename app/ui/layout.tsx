import { SideBar } from "./sidebar";
import { cn } from "../util/cn";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
}

export function Layout(props: Props) {
  const { children } = props;

  return (
    <html lang="en" className="h-full bg-white">
      <body className={cn(inter.className, "h-full")}>
        <div>
          <SideBar />

          <div className="lg:pl-72">
            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
