import { BackButton } from '@/frontend/ui/component/back-button';

import { CreateOneInputCategoryForm } from '@/frontend/ui/form/engineer/input-category/create/create.input.category.form';


export default async function Page() {
  return (
    <div>
      <div className="w-4/6 ring-1 ring-inset ring-gray-200 bg-white rounded-md px-6 py-8">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Criar Nova Categoria de Insumo
              </h1>
              <p className="text-sm text-gray-600">
                Preencha os dados para criar uma nova categoria.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <CreateOneInputCategoryForm />
        </div>
      </div>
    </div>
  );
}
