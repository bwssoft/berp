"use client";
import { useState } from "react";

export function useCreateAnnexHistoricalModal(onFileUploadSuccess?: (name: string, url: string) => void) {
  const [open, setOpen] = useState(false);
  
  const handleFileUploadSuccess = (name: string, url: string) => {
    if(onFileUploadSuccess) {
        onFileUploadSuccess(name, url);
    }
  };

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return {
    open,
    openModal,
    closeModal,
    handleFileUploadSuccess,
  };
}
