import {
  findManyInput,
  findManyProductCategory,
  findManyTechnology,
} from "@/app/lib/@backend/action";
import { ProductCreateForm } from "@/app/lib/@frontend/ui/component";

export default async function Page() {
  const [inputs, categories, technologies] = await Promise.all([
    findManyInput({}),
    findManyProductCategory({}),
    findManyTechnology(),
  ]);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de produto
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para registrar um produto.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ProductCreateForm
          inputs={inputs}
          categories={categories}
          technologies={technologies}
        />
      </div>
    </div>
  );
}
