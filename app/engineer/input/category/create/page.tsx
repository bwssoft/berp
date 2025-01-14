import { InputCategoryCreateForm } from "@/app/lib/@frontend/ui/form/engineer/input-category/create/input-category.create.form";

export default function InputCategoryCreatePage() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de categoria de insumo
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para registrar uma nova categoria para
            os insumos.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <InputCategoryCreateForm />
      </div>
    </div>
  );
}
