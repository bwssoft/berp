import { findManyComponentCategory } from "@/app/lib/@backend/action";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { IComponentCategory } from "@/app/lib/@backend/domain";
import { BackButton } from "@/app/lib/@frontend/ui/component";
import { ComponentCategoryTable } from "@/app/lib/@frontend/ui/table";
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
  const componentCategory = await findManyComponentCategory({
    filter: query({}),
    page,
  });
  const canCreate = await restrictFeatureByProfile(
    "engineer:component:category:create"
  );

  return (
    <div>
      <div className="flex flex-wrap items-center">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Categorias de componentes cadastradas
              </h1>
              <p className="text-sm text-gray-600">
                Gerencie as categorias de componentes do sistema.
              </p>
            </div>
          </div>
        </div>

        {canCreate && (
          <Link
            href="/engineer/component/category/form/create"
            className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            Nova categoria
          </Link>
        )}
      </div>
      <div className="mt-10">
        <ComponentCategoryTable currentPage={page} data={componentCategory} />
      </div>
    </div>
  );
}

function query(props: Props["searchParams"]): Filter<IComponentCategory> {
  const conditions: Filter<IComponentCategory>[] = [];
  return {};
}
