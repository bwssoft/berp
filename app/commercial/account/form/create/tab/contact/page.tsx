"use client";
import { Button } from "@/app/lib/@frontend/ui/component";
import { ContactCard } from "@/app/lib/@frontend/ui/list/comercial/contact/contact.card";
import {
  ContactModal,
  SearchContactModal,
  useContactModal,
} from "@/app/lib/@frontend/ui/modal";

interface Props {
  searchParams: {
    id?: string;
  };
}

export default function Page(props: Props) {
  const { searchParams } = props;
  const { open: openContact, openModal: openModalContact } = useContactModal();

  return (
    <div>
      <div className="flex gap-4 w-full justify-end">
        <SearchContactModal accountId={searchParams.id ?? ""} />
        <Button onClick={openModalContact}>Novo</Button>
        <ContactModal open={openContact} />
      </div>
      <div>
        <ContactCard accountId={searchParams.id ?? ""} />
      </div>
    </div>
  );
}
