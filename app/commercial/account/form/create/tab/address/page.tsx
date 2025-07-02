import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findManyAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { AddressDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/tab/address/address.data";
import { PageFooterButtons } from "./page-footer-buttons";

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
    const hasPermissionAddresses = await restrictFeatureByProfile(
        "commercial:accounts:access:tab:data:addresses"
    );

    return (
        <div>
            <AddressDataPage
                account={account}
                address={address}
                permissions={{
                    hasPermissionContacts: false,
                    hasPermissionAddresses,
                    hasPermissionEconomicGroup: false,
                }}
            />
            <PageFooterButtons
                accounts={!!account?.document?.type}
                addresses={address.length > 0}
                id={accountId}
            />
        </div>
    );
}
