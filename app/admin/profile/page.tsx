import { findManyProfile, restrictFeatureByProfile } from "@/app/lib/@backend/action";
import { IProfile } from "@/app/lib/@backend/domain";
import { SearchProfileForm } from "@/app/lib/@frontend/ui/form";
import { ProfileTable } from "@/app/lib/@frontend/ui/table";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Filter } from "mongodb";
import Link from "next/link";

interface Props {
  searchParams: {
    quick?: string;

    profile_id?: string[];
    active?: string[];
    page?: string;
  };
}
export default async function Example(props: Props) {
  const { searchParams: { page, ...rest } } = props;
  const _page = page ? Number(page) : 1;
  const profiles = await findManyProfile(query(rest), _page);

  const hideCreateButton = await restrictFeatureByProfile("admin:profile:create");
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Perfi
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos os perfis registrados na plataforma.
          </p>
        </div>

        {hideCreateButton && (
          <Link
            href="/admin/profile/form/create"
            className="ml-10 flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            Novo perfil
          </Link>
        )}
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <SearchProfileForm />
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <ProfileTable data={profiles} />
      </div>
    </div>
  );
}

function query(props: Props["searchParams"]): Filter<IProfile> {
  const conditions: Filter<IProfile>[] = [];

  if (props.quick) {
    const regex = { $regex: props.quick, $options: "i" };
    conditions.push({
      name: regex,
    });
  }

  if (props.profile_id) {
    const profile_id =
      typeof props.profile_id === "string"
        ? [props.profile_id]
        : props.profile_id;
    conditions.push({ id: { $in: profile_id } });
  }

  if (props.active) {
    // Converte as strings para booleanos ("true" => true, "false" => false)
    const statusBooleans =
      typeof props.active === "string"
        ? [props.active === "true"]
        : props.active.map((s) => s === "true");
    conditions.push({
      active: { $in: statusBooleans },
    });
  }

  // Combina as condições utilizando $and se houver mais de uma
  if (conditions.length === 1) {
    return conditions[0];
  }

  if (conditions.length > 1) {
    return { $and: conditions };
  }

  // Retorna um filtro vazio se não houver condições
  return {};
}
