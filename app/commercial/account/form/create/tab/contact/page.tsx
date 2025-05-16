"use client";
import { Button } from "@/app/lib/@frontend/ui/component";
import {
    ContactModal,
    SearchContactModal,
    useContactModal,
    useSearchContactModal,
} from "@/app/lib/@frontend/ui/modal";

interface Props {
    searchParams: {
        accountId?: string;
    };
}

export default async function Page(props: Props) {
    const { searchParams } = props;
    const { open: openContact, openModal: openModalContact } =
        useContactModal();
    const { open: openSearchContact, openModal: openModalSearchContact } =
        useSearchContactModal();

    return (
        <div className="flex gap-4 w-full justify-end">
            <Button onClick={openModalSearchContact}>Buscar contato</Button>
            <Button onClick={openModalContact}>Novo</Button>
            <SearchContactModal open={openSearchContact} contacts={[]} />
            <ContactModal open={openContact} />
        </div>
    );
}
