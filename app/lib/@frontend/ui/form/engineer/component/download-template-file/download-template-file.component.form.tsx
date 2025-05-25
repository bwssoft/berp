"use client";
import { useDownloadComponentTemplateFileForm } from "./use-download-template-file.component.form";

export function DownloadComponentTemplateFileForm() {
  const { handleSubmit } = useDownloadComponentTemplateFileForm();

  return (
    <form onSubmit={handleSubmit}>
      <button className="text-blue-600 bg-transparent hover:text-blue-500 underline underline-offset-2 hover:cursor-pointer">
        Baixe o modelo
      </button>
    </form>
  );
}
