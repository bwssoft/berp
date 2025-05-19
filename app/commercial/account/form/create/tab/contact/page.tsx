"use client";
import { Button } from "@/app/lib/@frontend/ui/component";
import {
  ContactModal,
  SearchContactModal,
  useContactModal,
  useSearchContactModal,
} from "@/app/lib/@frontend/ui/modal";
import { account } from "@/app/lib/constant/app-hashs";

interface Props {
  searchParams: {
    id?: string;
  };
}

export default function Page(props: Props) {
  const { searchParams } = props;
  const { open: openContact, openModal: openModalContact } = useContactModal();

  console.log("na page", searchParams.id);
  return (
    <div className="flex gap-4 w-full justify-end">
      <SearchContactModal accountId={searchParams.id ?? ""} />
      <Button onClick={openModalContact}>Novo</Button>
      <ContactModal open={openContact} />
    </div>
  );
}
