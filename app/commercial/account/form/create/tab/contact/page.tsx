"use client";

import { useCreateAccountFlow } from "@/app/lib/@frontend/context/create-account-flow.context";
import { ContactDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/tab/contact/contact.data";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";

export default function Page() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");

  const { account, contacts } = useCreateAccountFlow();
  const [hasPermissionContacts, setHasPermissionContacts] = useState(false);

  // Check permission on component mount
  useEffect(() => {
    const checkPermission = async () => {
      const permission = await restrictFeatureByProfile(
        "commercial:accounts:access:tab:data:contacts"
      );
      setHasPermissionContacts(permission);
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
    <ContactDataPage
      account={account!}
      contacts={contacts}
      hasPermissionContacts={hasPermissionContacts}
      accountId={accountId}
    />
  );
}
