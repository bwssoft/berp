"use client";

import { useState } from "react";

export function useCreateAnnexHistoricalModal() {
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
    console.log("Modal opened");
  }

  function closeModal() {
    setOpen(false);
  }

  return {
    open,
    openModal,
    closeModal,
  };
}
