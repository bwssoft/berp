"use client";

import { useState } from "react";

export function useUpdateContactModal() {
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function updateContact() {
    // Logic for updating a contact can be added here
  }

  function updateContactLocally() {
    // Logic for updating a contact can be added here
  }

  return {
    open,
    openModal,
    closeModal,
    updateContact,
    updateContactLocally,
  };
}
