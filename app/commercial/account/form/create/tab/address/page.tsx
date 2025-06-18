"use client";

import { AddressCardList } from "@/app/lib/@frontend/ui/list/comercial/address/address.list";
import { PageFooterButtons } from "./page-footer-buttons";
import { CreateAddressModal } from "./create-address";
import { useAddresses } from "@/app/lib/@frontend/ui/form/commercial/address/get/useaddress";
import { useAccount } from "@/app/lib/@frontend/ui/form/commercial/address/get/useaccount";
import { useRouter } from "next/navigation";

interface Props {
  searchParams: { id: string };
}

export default function Page({ searchParams }: Props) {
  const { id } = searchParams;
  const router = useRouter();

  const { addresses, loading: loadingAddresses } = useAddresses(id);
  const { account, loading: loadingAccount } = useAccount(id);

  if (loadingAddresses || loadingAccount) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <CreateAddressModal id={id} />
        <AddressCardList items={addresses} />
      </div>
      <footer>
        <PageFooterButtons
          accounts={!!account?.document?.type}
          addresses={addresses.length > 0}
          id={id}
        />
      </footer>
    </div>
  );
}
