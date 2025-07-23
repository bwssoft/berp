"use client";

import { useAddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address/use-address.modal";
import { CreatedAddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address";
import { Button } from "@/app/lib/@frontend/ui/component";
import { Plus } from "lucide-react";

interface Props {
  id: string;
}

export function CreateAddressModal({ id }: Props) {
  const { open, openModal, closeModal, createAddressLocally } =
    useAddressModal();

  return (
    <>
      <CreatedAddressModal
        createAddress={createAddressLocally}
        open={open}
        closeModal={closeModal}
        accountId={id}
      />
      <div className="flex justify-end items-end gap-4 mt-4">
        <Button
          variant={"ghost"}
          className="border px-3 py-3"
          onClick={openModal}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
