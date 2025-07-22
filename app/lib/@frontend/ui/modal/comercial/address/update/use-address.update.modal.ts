"use client";

import { useState } from "react";

export function useAddressUpdateModal() {
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function updateAddress() {
    // Logic for updating the address can be added here
    // This function can be used to handle the update action
  }

  function updateAddressLocally() {
    // Logic for updating the address can be added here
    // This function can be used to handle the update action
  }

  return {
    open,
    openModal,
    closeModal,
    updateAddress,
    updateAddressLocally,
  };
}
