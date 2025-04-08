import { findManyProfile, findManyUser } from "@/app/lib/@backend/action";
import { SearchProfileForm } from "@/app/lib/@frontend/ui/form";
import { SearchUserForm } from "@/app/lib/@frontend/ui/form/admin/user/search-form/search.user.form";
import { UserTable } from "@/app/lib/@frontend/ui/table/admin/user";
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

interface Props {
  searchParams: {};
}
export default async function Example(props: Props) {
  const { searchParams } = props;
  console.log(searchParams)
  const users = await findManyUser({ ...searchParams });
  
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Usuários
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos os usuários registrados na plataforma.
          </p>
        </div>

        <Link
          href="/admin/user/form/create"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          Novo Usuário
        </Link>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <SearchUserForm />
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <UserTable data={users} />
      </div>
    </div>
  );
}
