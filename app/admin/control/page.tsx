import { findManyControl } from "@/app/lib/@backend/action/admin/control.action";
import { findOneProfile } from "@/app/lib/@backend/action/admin/profile.action";
import { ChooseProfileForm } from "@/app/lib/@frontend/ui/form";
import { ModuleControlList } from "@/app/lib/@frontend/ui/list";

interface Props {
  searchParams: {
    profile_id?: string[];
  };
}
export default async function Example(props: Props) {
  const { searchParams } = props;
  const [profile, controls] = await Promise.all([
    findOneProfile({ id: searchParams.profile_id }),
    findManyControl({ parent_code: undefined }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Controle de Acesso
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Tela para o gerenciamento de acessos que cada perfil pode fazer.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ChooseProfileForm profile={profile} />
      </div>
      <div className="mt-10 px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 lg:p-8 ring-1 ring-inset ring-gray-900/10 rounded-md shadow-sm bg-white">
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            {profile?.name ? `Perfil: ${profile.name}` : "Listagem dos módulos"}
          </h1>
          <div className="mt-4 border-b border-gray-900/10" />
          <ModuleControlList controls={controls} profile={profile} />
        </div>
      </div>
    </div>
  );
}
