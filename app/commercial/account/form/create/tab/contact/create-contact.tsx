"use client";

import { Button } from "@/app/lib/@frontend/ui/component";
import {
  CreateContactModal,
  useCreateContactModal,
} from "@/app/lib/@frontend/ui/modal";
import { Plus } from "lucide-react";

export function CreateContact() {
  const {
    open: openContact,
    openModal: openModalContact,
    closeModal,
  } = useCreateContactModal();

  return (
    <>
      <CreateContactModal closeModal={closeModal} open={openContact} />
      <div>
        <Button variant={"ghost"} className="border px-3 py-3" onClick={openModalContact}><Plus className="h-4 w-4" /></Button>
      </div>
    </>
  );
}
