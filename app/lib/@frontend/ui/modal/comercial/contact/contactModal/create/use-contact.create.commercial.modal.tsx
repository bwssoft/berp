"use client";

import { useState } from "react";

export function useCreateContactModal() {
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function createContact() {
    // Logic for creating a contact can be added here
  }

  function createContactLocally() {
    // Logic for creating a contact can be added here
  }

  return {
    open,
    openModal,
    closeModal,
    createContact,
    createContactLocally,
  };
}
