import { findManyUser, restrictFeatureByProfile } from "@/app/lib/@backend/action";
import { IUser } from "@/app/lib/@backend/domain";
import { SearchUserForm } from "@/app/lib/@frontend/ui/form/admin/user/search-form/search.user.form";
import { UserTable } from "@/app/lib/@frontend/ui/table/admin/user";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Filter } from "mongodb";
import Link from "next/link";

interface Props {
  searchParams: {
    quick?: string;
    page?:string;
    name?: string;
    cpf?: string;
    profile_id?: string[] | string;
    username?: string;
    email?: string;
    active?: string[] | string;
    start_date?: Date;
    end_date?: Date;
    external?: string[] | string;
  };
}
export default async function Example(props: Props) {
  const { searchParams: { page, ...rest } } = props
  const _page = page?.length && Number(page)
  const users = await findManyUser(query(rest), _page);
  const canCreate = await restrictFeatureByProfile("admin:user:create");
  
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

        {canCreate && (
          <Link
            href="/admin/user/form/create"
            className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            Novo Usuário
          </Link>
        )}
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <SearchUserForm />
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <UserTable currentPage={_page} data={users} />
      </div>
    </div>
  );
}

function query(props: Props["searchParams"]): Filter<IUser> {
  const conditions: Filter<IUser>[] = [];

  if (props.quick) {
    const regex = { $regex: props.quick, $options: "i" };
    conditions.push({
      $or: [
        { cpf: regex },
        { username: regex },
        { email: regex },
        { name: regex },
        { "profile.name": regex },
      ],
    });
  }

  if (props.name) {
    const regex = { $regex: props.name, $options: "i" };
    conditions.push({ name: regex });
  }

  if (props.cpf) {
    const regex = { $regex: props.cpf, $options: "i" };
    conditions.push({ cpf: regex });
  }

  if (props.username) {
    const regex = { $regex: props.username, $options: "i" };
    conditions.push({ username: regex });
  }

  if (props.email) {
    const regex = { $regex: props.email, $options: "i" };
    conditions.push({ email: regex });
  }

  if (props.profile_id) {
    const profile_id =
      typeof props.profile_id === "string"
        ? [props.profile_id]
        : props.profile_id;
    conditions.push({ "profile.id": { $in: profile_id } });
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

  if (props.external) {
    const externalBooleans =
      typeof props.external === "string"
        ? [props.external === "true"]
        : props.external.map((s) => s === "true");
    conditions.push({
      external: { $in: externalBooleans },
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
