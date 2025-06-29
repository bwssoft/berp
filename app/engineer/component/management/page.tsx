import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findManyComponent } from "@/app/lib/@backend/action/engineer/component/component.action";
import { IComponent } from "@/app/lib/@backend/domain";
import { BackButton } from "@/app/lib/@frontend/ui/component";
import { ComponentTable } from "@/app/lib/@frontend/ui/table";
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
  const page = searchParams?.page?.length && Number(searchParams.page);
  const components = await findManyComponent({
    filter: query({}),
    page,
  });
  const canCreate = await restrictFeatureByProfile("engineer:component:create");

  return (
    <div>
      <div className="flex flex-wrap items-center">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Componentes Cadastrados
              </h1>
              <p className="text-sm text-gray-600">
                Gerencie as componentes do sistema.
              </p>
            </div>
          </div>
        </div>

        {canCreate && (
          <Link
            href="/engineer/component/form/create"
            className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            Novo componente
          </Link>
        )}
      </div>
      <div className="mt-10">
        <ComponentTable currentPage={page} data={components} />
      </div>
    </div>
  );
}

function query(props: Props["searchParams"]): Filter<IComponent> {
  const conditions: Filter<IComponent>[] = [];
  return {};
}
