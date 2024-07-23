import { findAllProduct } from "@/app/lib/@backend/action";
import { ProductTable } from "@/app/lib/@frontend/ui";
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default async function Example() {
  const products = await findAllProduct();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Gestão de Produtos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todas os produtos registrados na sua conta.
          </p>
        </div>

        <Link
          href="/product/form/create"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          Novo Produto
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <ProductTable data={products} />
      </div>
    </div>
  );
}
