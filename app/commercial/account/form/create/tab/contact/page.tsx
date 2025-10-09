"use client";

import { useCreateAccountFlow } from "@/app/lib/@frontend/context/create-account-flow.context";
import { ContactDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/tab/contact/contact.data";
import { AccountNotFoundState } from '@/frontend/ui/component/empty-state/empty-state';

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { restrictFeatureByProfile } from "@/backend/action/auth/restrict.action";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  if (!accountId) {
    return (
      <AccountNotFoundState
        title="ID da conta não fornecido"
        description="Não foi possível identificar a conta. Verifique se você acessou esta página através do fluxo correto de criação de conta."
        action={{
          label: "Voltar ao início",
          onClick: () => router.push("/commercial/account/form/create"),
          variant: "outline",
        }}
      />
    );
  }

  if (!account?.document.value) {
    return (
      <AccountNotFoundState
        title="Conta não encontrada no contexto local"
        description="Os dados da conta não foram encontrados. Isso pode acontecer se você navegou diretamente para esta página ou se os dados foram perdidos."
        action={{
          label: "Criar nova conta",
          onClick: () => router.push("/commercial/account/form/create"),
          variant: "outline",
        }}
      />
    );
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

