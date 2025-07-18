import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findManyAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { ContactDataPage } from "@/app/lib/@frontend/ui/page/commercial/account/tab/contact/contact.data";

interface PageProps {
    searchParams: {
        id?: string;
    };
}

export default async function Page({ searchParams }: PageProps) {
    const account = await findOneAccount({ id: searchParams.id });

    const hasPermissionContacts = await restrictFeatureByProfile(
        "commercial:accounts:access:tab:data:contacts"
    );

    const accountId = account?.id ?? "";

    const addresses = await findManyAddress({ accountId });

    return (
        <ContactDataPage
            contacts={account?.contacts ?? []}
            hasPermissionContacts={hasPermissionContacts}
            accountId={accountId}
            addresses={addresses}
        />
    );
}
