import { BackButton } from "@/app/lib/@frontend/ui/component";
import { CreateOneComponentCategoryForm } from "@/app/lib/@frontend/ui/form";

export default async function Page() {
  return (
    <div>
      <div className="w-4/6 ring-1 ring-inset ring-gray-200 bg-white rounded-md px-6 py-8">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Criar Nova Categoria de Componente
              </h1>
              <p className="text-sm text-gray-600">
                Preencha os dados para criar uma nova categoria.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <CreateOneComponentCategoryForm />
        </div>
      </div>
    </div>
  );
}
