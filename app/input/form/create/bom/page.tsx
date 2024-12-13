import { InputCreateFromFileForm } from "@/app/lib/@frontend/ui";
import { DownloadInputBOMForm } from "@/app/lib/@frontend/ui/form/engineer/input/download-file-model/download-input-category-bom.form";

export default function Page() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de insumos por planilha
          </h1>
          <div className="flex items-center gap-1 mt-1 text-sm leading-6 text-gray-600">
            <DownloadInputBOMForm />
            <p>
              e depois faça o upload da planilha para registrar insumos em
              massa.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <InputCreateFromFileForm />
      </div>
    </div>
  );
}
