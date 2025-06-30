import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findManyAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { AccountDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/data/account.data";

interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const { id: accountId } = searchParams;

  const account = await findOneAccount({ id: accountId });

  if (!account) return <>Conta não encontrada</>;

  const address = await findManyAddress({ accountId });

  const hasPermissionContacts = await restrictFeatureByProfile(
    "commercial:accounts:access:tab:data:contacts"
  );

  const hasPermissionAddresses = await restrictFeatureByProfile(
    "commercial:accounts:access:tab:data:addresses"
  );

  const hasPermissionEconomicGroup = await restrictFeatureByProfile(
    "commercial:accounts:access:tab:data:group-edit"
  );

  return (
    <AccountDataPage
      address={address}
      account={account}
      permissions={{
        hasPermissionContacts,
        hasPermissionAddresses,
        hasPermissionEconomicGroup,
      }}
    />
  );
}
