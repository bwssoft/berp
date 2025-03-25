import { findManyProfile } from "@/app/lib/@backend/action";
import { IProfile } from "@/app/lib/@backend/domain";
import { SearchProfileForm } from "@/app/lib/@frontend/ui/form";
import { ProfileTable } from "@/app/lib/@frontend/ui/table";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Filter } from "mongodb";
import Link from "next/link";

interface Props {
  searchParams: {
    profile_name?: string;
    profile_id?: string[];
    user_id?: string;
    status?: string[];
  };
}
export default async function Example(props: Props) {
  const { searchParams } = props;
  const profiles = await findManyProfile(query(searchParams));
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Perfis
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos os perfis registrados na plataforma.
          </p>
        </div>

        <Link
          href="/admin/profile/form/create"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          Novo perfil
        </Link>
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

const query = (params: Props["searchParams"]): Filter<IProfile> => {
  const query: Filter<IProfile> = {};
  if (params.profile_name)
    query.name = { $regex: params.profile_name, $options: "i" };
  return query;
};
