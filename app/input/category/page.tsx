import { findAllInputCategories } from "@/app/lib/@backend/action";
import { InputCategoryTable } from "@/app/lib/@frontend/ui/table";
import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default async function InputCategoryPage() {
  const inputCategories = await findAllInputCategories();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div className="w-96">
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Gestão de categoria de insumos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todas as categorias registradas para a associação em
            insumos existentes.
          </p>
        </div>

        <div className="ml-auto flex gap-6">
          <Link
            href="/input/category/create/bom"
            className="flex items-center gap-x-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ArrowUpTrayIcon className="-ml-1.5 h-4 w-4" aria-hidden="true" />
            B.O.M
          </Link>

          <Link
            href="/input/category/create"
            className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            Nova categoria de insumo
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <InputCategoryTable data={inputCategories} />
      </div>
    </div>
  );
}
