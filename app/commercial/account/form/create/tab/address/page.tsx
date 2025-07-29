"use client";

import { useCreateAccountFlow } from "@/app/lib/@frontend/context/create-account-flow.context";
import { AddressDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/tab/address/address.data";
import { PageFooterButtons } from "./page-footer-buttons";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";

export default function Page() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");

  const { account, addresses } = useCreateAccountFlow();
  const [hasPermissionAddresses, setHasPermissionAddresses] = useState(false);

  // Check permission on component mount
  useEffect(() => {
    const checkPermission = async () => {
      const permission = await restrictFeatureByProfile(
        "commercial:accounts:access:tab:data:addresses"
      );
      setHasPermissionAddresses(permission);
    };
    checkPermission();
  }, []);

  // Verify that the account exists and matches the accountId from URL
  const isValidAccount = useMemo(() => {
    return account && account.id === accountId;
  }, [account, accountId]);

  if (!accountId) {
    return <div>ID da conta não fornecido</div>;
  }

  if (!isValidAccount) {
    return <div>Conta não encontrada no contexto local</div>;
  }

  return (
    <div>
      <AddressDataPage
        account={account!}
        address={addresses}
        permissions={{
          hasPermissionContacts: false,
          hasPermissionAddresses,
          hasPermissionEconomicGroup: false,
        }}
      />
      <PageFooterButtons
        accounts={!!account?.document?.type}
        addresses={addresses.length > 0}
        id={accountId}
      />
    </div>
  );
}
