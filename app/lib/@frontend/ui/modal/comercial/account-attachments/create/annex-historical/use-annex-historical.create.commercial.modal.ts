"use client";
import { useState } from "react";



export function useCreateAnnexHistoricalModal(onFileUploadSuccess?: (fileUrl: string) => void) {
  const [open, setOpen] = useState(false);
  
  const handleFileUploadSuccess = (url: string) => {
    if(onFileUploadSuccess) {
        onFileUploadSuccess(url);
    }
  };

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
    handleFileUploadSuccess,
  };
}
