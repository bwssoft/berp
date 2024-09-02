import { InputCategoryCreateFromFileForm } from "@/app/lib/@frontend/ui/form/input-category/input-category.create-from-file.form";

export default function InputCategoryCreateBOMPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de categorias de insumos por planilha
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            <a
              href={"/xlsx/create-input-category-from-file.xlsx"}
              download={"create-input-category-from-file.xlsx"}
              className="text-indigo-600 hover:text-indigo-500 underline underline-offset-2 hover:cursor-pointer"
            >
              Baixe o modelo
            </a>{" "}
            e depois faça o upload da planilha para registrar categorias de insumo em massa.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <InputCategoryCreateFromFileForm />
      </div>
    </div>
  );
}
