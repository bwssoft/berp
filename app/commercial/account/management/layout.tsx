"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/app/lib/@frontend/ui/component/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { useQueries } from "@tanstack/react-query";

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

  const permissionQueries = useQueries({
    queries: [
      {
        queryKey: [
          "restrictFeatureByProfile",
          "commercial:accounts:access:tab:data:enable",
        ],
        queryFn: () =>
          restrictFeatureByProfile(
            "commercial:accounts:access:tab:data:enable"
          ),
      },
      {
        queryKey: [
          "restrictFeatureByProfile",
          "commercial:accounts:access:tab:history",
        ],
        queryFn: () =>
          restrictFeatureByProfile("commercial:accounts:access:tab:history"),
      },
      {
        queryKey: [
          "restrictFeatureByProfile",
          "commercial:accounts:access:tab:attachments:enable",
        ],
        queryFn: () =>
          restrictFeatureByProfile(
            "commercial:accounts:access:tab:attachments:enable"
          ),
      },
    ],
  });

  const isLoadingPermissions = permissionQueries.some(
    (query) => query.isLoading
  );
  const permissions = {
    dataTab: permissionQueries[0]?.data ?? true,
    historyTab: permissionQueries[1]?.data ?? true,
    attachmentsTab: permissionQueries[2]?.data ?? true,
  };

  const handleTabChange = useCallback(
    (tab: string) => {
      if (!accountId) return;
      router.push(`/commercial/account/management/${tab}?id=${accountId}`);
    },
    [accountId, router]
  );

  useEffect(() => {
    const path = pathname.split("/").pop();
    if (path) {
      setActiveTab(path);
    }
  }, [pathname]);

  return (
    <div className="flex flex-col w-full gap-4">
      <Tabs value={activeTab} className="w-full">
        {isLoadingPermissions ? (
          <TabsList className="bg-transparent border-gray-200"></TabsList>
        ) : (
          <TabsList className="bg-transparent border-gray-200">
            {permissions.dataTab && (
              <TabsTrigger
                className="data-[state=active]:bg-transparent hover:bg-gray-50"
                value="account-data"
                onClick={() => handleTabChange("account-data")}
              >
                Dados da conta
              </TabsTrigger>
            )}
            {permissions.historyTab && (
              <TabsTrigger
                className="data-[state=active]:bg-transparent hover:bg-gray-50"
                value="historical"
                onClick={() => handleTabChange("historical")}
              >
                Histórico
              </TabsTrigger>
            )}
            {permissions.attachmentsTab && (
              <TabsTrigger
                className="data-[state=active]:bg-transparent hover:bg-gray-50"
                value="account-attachments"
                onClick={() => handleTabChange("account-attachments")}
              >
                Anexos
              </TabsTrigger>
            )}
          </TabsList>
        )}
      </Tabs>

      <div className="p-4">{children}</div>
    </div>
  );
}
