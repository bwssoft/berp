"use client";
import { useState } from "react";

export function useCreateAnnexHistoricalModal(onFileUploadSuccess?: (name: string, url: string, id: string) => void) {
  const [open, setOpen] = useState(false);
  
  const handleFileUploadSuccess = (name: string, url: string, id:string) => {
    if(onFileUploadSuccess) {
        onFileUploadSuccess(name, url, id);
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
