import { findManyComponentCategory } from "@/backend/action/engineer/component/component.category.action";
import { BackButton } from '@/frontend/ui/component/back-button';

import { CreateOneComponentForm } from '@/frontend/ui/form/engineer/component/create/component.create.form';


export default async function Page() {
  const { docs: categories } = await findManyComponentCategory({ filter: {} });
  return (
    <div>
      <div className="w-4/6 ring-1 ring-inset ring-gray-200 bg-white rounded-md px-6 py-8">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Criar Novo Componente
              </h1>
              <p className="text-sm text-gray-600">
                Preencha os dados para criar um novo componente.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <CreateOneComponentForm categories={categories} />
        </div>
      </div>
    </div>
  );
}

