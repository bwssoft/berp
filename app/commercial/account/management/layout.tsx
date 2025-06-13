"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/app/lib/@frontend/ui/component/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState<string>("account-data");

  // Set active tab based on current pathname
  useEffect(() => {
    const path = pathname.split("/").pop();
    if (path) {
      setActiveTab(path);
    }
  }, [pathname]);

  const handleTabChange = (tab: string) => {
    if (!accountId) return;
    router.push(`/commercial/account/management/${tab}?id=${accountId}`);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="bg-transparent border-gray-200">
          <TabsTrigger
            className="data-[state=active]:bg-transparent hover:bg-gray-50"
            value="account-data"
            onClick={() => handleTabChange("account-data")}
          >
            Dados da conta
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-transparent hover:bg-gray-50"
            value="historical"
            onClick={() => handleTabChange("historical")}
          >
            Histórico
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-transparent hover:bg-gray-50"
            value="account-attachments"
            onClick={() => handleTabChange("account-attachments")}
          >
            Anexos
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="p-4">{children}</div>
    </div>
  );
}
