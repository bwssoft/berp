"use client";

import { Button } from "@/app/lib/@frontend/ui/component";
import {
  CreateContactModal,
  useCreateContactModal,
} from "@/app/lib/@frontend/ui/modal";

export function CreateContact() {
  const {
    open: openContact,
    openModal: openModalContact,
    closeModal,
  } = useCreateContactModal();

  return (
    <>
      <CreateContactModal closeModal={closeModal} open={openContact} />
      <div className="flex justify-end items-end gap-4 mt-4">
        <Button onClick={openModalContact}>Novo</Button>
      </div>
    </>
  );
}
