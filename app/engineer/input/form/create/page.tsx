import { findManyInputCategory } from "@/app/lib/@backend/action/engineer/input/input.category.action";
import { BackButton } from "@/app/lib/@frontend/ui/component";
import { CreateOneInputForm } from "@/app/lib/@frontend/ui/form";

export default async function Page() {
  const { docs: categories } = await findManyInputCategory({ filter: {} });
  return (
    <div>
      <div className="w-4/6 ring-1 ring-inset ring-gray-200 bg-white rounded-md px-6 py-8">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Criar Novo Insumo
              </h1>
              <p className="text-sm text-gray-600">
                Preencha os dados para criar um novo insumo.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <CreateOneInputForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
