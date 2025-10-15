import { findOneUser } from "@/backend/action/admin/user.action";
import { UpdateOneUserForm } from '@/frontend/ui/form/admin/user/update-one/update-one.user.form';


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
              Ops.
            </h1>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Usuário não existente.
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
            Atualização de usuário - {user.name}
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar um usuário.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <UpdateOneUserForm user={user} />
      </div>
    </div>
  );
}

