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
        <div className="min-h-screen flex flex-col">
            <div className="flex-1">
                <CreateAddressModal id={id} />
                <AddressCardList items={addresses} />
            </div>
            <footer className="">
                <PageFooterButtons id={id} />
            </footer>
        </div>
    );
}
