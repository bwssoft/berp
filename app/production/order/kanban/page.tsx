import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { KanbanContainer } from "./components/kanban-container";
import { findManyProductionOrder } from "@/app/lib/@backend/action/production/production-order.action";

export const revalidate = 10;

export default async function Example() {
  const productionOrders = await findManyProductionOrder({});
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Kanban Ordens de Produção
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Um quadro de todas as ordens de produção registrados na sua conta.
          </p>
        </div>

        <Link
          href="/production/production-order/form/create"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          Nova ordem de produção
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <KanbanContainer productionOrders={productionOrders} />
      </div>
    </div>
  );
}
