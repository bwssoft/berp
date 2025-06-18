"use client";

import { useAddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address/use-address.modal";
import { AddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address";
import { Button } from "@/app/lib/@frontend/ui/component";

interface Props {
  id: string;
}

export function CreateAddressModal({ id }: Props) {
  const { open, openModal, closeModal } = useAddressModal();

  return (
    <>
      <AddressModal open={open} closeModal={closeModal} accountId={id} />
      <div className="flex justify-end items-end gap-4 mt-4">
        <Button onClick={openModal} type="button" className="h-fit">
          Novo
        </Button>
      </div>
    </>
  );
}
