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

  if (!account) {
    return (
      <div className="p-4">
        <h1>Conta não encontrada</h1>
        <p>ID procurado: {accountId}</p>
        <p>
          A conta pode ainda estar sendo criada. Aguarde alguns segundos e
          recarregue a página.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Recarregar página
        </button>
      </div>
    );
  }

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
