import { findAllInputTransactionWithInput } from "@/app/@lib/backend/action";
import { InputTransactionTable } from "@/app/@lib/frontend/ui";
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default async function Example() {
  const inputTransactions = await findAllInputTransactionWithInput();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-6 sm:flex-nowrap">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Entradas e Saídas
            </h1>
            {/* <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
              <a href="#" className="text-indigo-600">
                Últimos 7 dias
              </a>
              <a href="#" className="text-gray-700">
                Últimos 30 dias
              </a>
              <a href="#" className="text-gray-700">
                Tempo todo
              </a>
            </div> */}
          </div>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos as entradas e saídas de insumos registrados na
            sua conta.
          </p>
        </div>
        <Link
          href="/input/form/create/enter-exit"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          Novo Regitro
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <InputTransactionTable data={inputTransactions} />
      </div>
    </div>
  );
}
