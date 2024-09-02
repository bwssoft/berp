"use client";
import { useDownloadInputBOMForm } from "./use-download-input-bom-form";

export function DownloadInputBOMForm() {
  const { handleSubmit } = useDownloadInputBOMForm();

  return (
    <form onSubmit={handleSubmit}>
      <button className="text-indigo-600 bg-transparent hover:text-indigo-500 underline underline-offset-2 hover:cursor-pointer">
        Baixe o modelo
      </button>
    </form>
  );
}
