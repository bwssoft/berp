import { findManyAddress, findOneAccount } from "@/app/lib/@backend/action";
import { AddressCardList } from "@/app/lib/@frontend/ui/list/comercial/address/address.list";
import { IAccount, IAddress } from "@/app/lib/@backend/domain";

import { PageFooterButtons } from "./page-footer-buttons";
import { CreateAddressModal } from "./create-address";
import { useQuery } from "@tanstack/react-query";

interface Props {
  searchParams: { id: string };
}

export default async function Page({ searchParams }: Props) {
  const { id } = searchParams;
  const addresses: IAddress[] = await findManyAddress({ accountId: id });

  const account: IAccount = (await findOneAccount({ id })) as IAccount;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <CreateAddressModal id={id} />
        <AddressCardList items={addresses} />
      </div>
      <footer className="">
        <PageFooterButtons
          accounts={account.document.type.length > 0}
          addresses={addresses.length > 0}
          id={id}
        />
      </footer>
    </div>
  );
}
