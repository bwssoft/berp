import { findAllInput } from "@/app/lib/action";
import ProductCreateForm from "@/app/ui/form/product/product.create.form";

export default async function Page() {
  const inputs = await findAllInput();
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
        <ProductCreateForm inputs={inputs} />
      </div>
    </div>
  );
}