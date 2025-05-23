import { findManyAddress } from "@/app/lib/@backend/action";
import { AddressCardList } from "@/app/lib/@frontend/ui/list/comercial/address/address.list";
import { IAddress } from "@/app/lib/@backend/domain";

import { PageFooterButtons } from "./page-footer-buttons";
import { CreateAddressModal } from "./create-address";

interface Props {
    searchParams: { id: string };
}

export default async function Page({ searchParams }: Props) {
    const { id } = searchParams;
    const addresses: IAddress[] = await findManyAddress({ accountId: id });

    return (
        <div>
            <CreateAddressModal id={id} />
            <AddressCardList items={addresses} />
            <PageFooterButtons id={id} />
        </div>
    );
}
