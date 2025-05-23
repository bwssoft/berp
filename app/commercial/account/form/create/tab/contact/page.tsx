"use client";
import { Button } from "@/app/lib/@frontend/ui/component";
import { ContactCard } from "@/app/lib/@frontend/ui/list/comercial/contact/contact.card";
import { SearchContactModal } from "@/app/lib/@frontend/ui/modal";
import {
  CreateContactModal,
  useCreateContactModal,
} from "@/app/lib/@frontend/ui/modal/comercial/contact/contactModal";
import { PageFooterButtons } from "./page-footer-buttons";

interface Props {
  searchParams: {
    id?: string;
  };
}

export default function Page(props: Props) {
  const { searchParams } = props;
  const {
    open: openContact,
    openModal: openModalContact,
    closeModal,
  } = useCreateContactModal();

  return (
    <div>
      <div className="flex gap-4 w-full justify-end">
        <SearchContactModal accountId={searchParams.id ?? ""} />
        <Button onClick={openModalContact}>Novo</Button>
        <CreateContactModal closeModal={closeModal} open={openContact} />
      </div>
      <div>
        <ContactCard accountId={searchParams.id ?? ""} />
      </div>
      <footer className="">
        <PageFooterButtons id={searchParams.id ?? ""} />
      </footer>
    </div>
  );
}
