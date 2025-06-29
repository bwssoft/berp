"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/app/lib/@frontend/ui/component/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";

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
  const [permissions, setPermissions] = useState({
    dataTab: true,
    historyTab: true,
    attachmentsTab: true,
  });

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

  // Fetch permissions for tabs
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const [
          dataTabPermission,
          historyTabPermission,
          attachmentsTabPermission,
        ] = await Promise.all([
          restrictFeatureByProfile(
            "commercial:accounts:access:tab:data:enable"
          ),
          restrictFeatureByProfile("commercial:accounts:access:tab:history"),
          restrictFeatureByProfile(
            "commercial:accounts:access:tab:attachments:enable"
          ),
        ]);

        setPermissions({
          dataTab: dataTabPermission,
          historyTab: historyTabPermission,
          attachmentsTab: attachmentsTabPermission,
        });
      } catch (error) {
        console.error("Error fetching tab permissions:", error);
      }
    };

    fetchPermissions();
  }, [pathname, handleTabChange]);

  return (
    <div className="flex flex-col w-full gap-4">
      <Tabs value={activeTab} className="w-full">
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
      </Tabs>

      <div className="p-4">{children}</div>
    </div>
  );
}
