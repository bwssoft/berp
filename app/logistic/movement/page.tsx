import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findManyMovement } from "@/app/lib/@backend/action/logistic/movement.action";
import { IMovement } from "@/app/lib/@backend/domain";
import { BackButton } from "@/app/lib/@frontend/ui/component";
import { MovementTable } from "@/app/lib/@frontend/ui/table/logistic/movement/movement.table";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Filter } from "mongodb";
import Link from "next/link";

interface Props {
  searchParams: {
    page?: string;
  };
}
export default async function Example(props: Props) {
  const { searchParams } = props;
  const page = searchParams.page?.length && Number(searchParams.page);
  const bases = await findManyMovement({
    filter: query({}),
    page,
  });
  const canCreate = await restrictFeatureByProfile("logistic:base:create");

  return (
    <div>
      <div className="flex flex-wrap items-center">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Movimentações das bases
              </h1>
              <p className="text-sm text-gray-600">
                Gerencie todas as movimentações de itens das bases
              </p>
            </div>
          </div>
        </div>

        {canCreate && (
          <Link
            href="/logistic/movement/form/create"
            className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            Registrar movimentação
          </Link>
        )}
      </div>
      <div className="mt-10">
        <MovementTable currentPage={page} data={bases} />
      </div>
    </div>
  );
}

function query(props: Props["searchParams"]): Filter<IMovement> {
  const conditions: Filter<IMovement>[] = [];
  return {};
}
