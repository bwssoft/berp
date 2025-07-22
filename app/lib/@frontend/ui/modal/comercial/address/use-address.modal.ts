"use client";

import { deleteOneAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useState } from "react";

export function useAddressModal() {
  const [open, setOpen] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  function openModal() {
    setOpen(true);
  }

  function openModalDeleteCard() {
    setOpenModalDelete(true);
  }
  function closeModal() {
    setOpen(false);
  }

  async function createAddress() {
    // Logic for updating the address can be added here
    // This function can be used to handle the update action
  }

  function createAddressLocally() {
    // Logic for updating the address can be added here
    // This function can be used to handle the update action
  }

  return {
    open,
    openModal,
    closeModal,
    openModalDelete,
    setOpenModalDelete,
    openModalDeleteCard,
    createAddress,
    createAddressLocally,
  };
}
