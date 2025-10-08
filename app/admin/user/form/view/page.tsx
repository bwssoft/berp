import { findOneUser } from "@/app/lib/@backend/action/admin/user.action";
import { ViewOneUserForm } from '@/frontend/ui/form/admin/user/view-one/view-one.user.form';


interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const user = await findOneUser({ id });
  if (!user) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Ops...
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Usuário não encontrado.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Usuário - {user.name}
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Informações detalhadas sobre o usuário.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ViewOneUserForm user={user} />
      </div>
    </div>
  );
}
