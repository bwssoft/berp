import {
  countControl,
  findManyControl,
  findOneControl,
} from "@/backend/action/admin/control.action";
import { findOneProfile } from "@/backend/action/admin/profile.action";
import { SubModuleControlList } from "@/app/lib/@frontend/ui/list/admin/sub-module.control.list";
import { buildControlTree } from "@/app/lib/util";

interface Props {
  params: Promise<{
    slug: [
      string, //control_id
      string, //profile_id
    ];
  }>;
}
export default async function Example(props: Props) {
  const { slug } = await props.params;
  const control = await findOneControl({ id: slug[0] });
  if (!control)
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhum controle encontrado
            </h1>
          </div>
        </div>
      </div>
    );

  const [profile, controls, total_controls_on_module] = await Promise.all([
    findOneProfile({ id: slug[1] }),
    findManyControl(
      { parent_code: { $regex: control.code, $options: "i" } },
      undefined,
      50
    ),
    countControl({ parent_code: { $regex: control.code, $options: "i" } }),
  ]);

  const control_tree = buildControlTree(controls.docs);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Controle de Acesso - {control.name}{" "}
            {profile?.name ? `- ${profile.name}` : ""}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Tela para o gerenciamento de acessos que cada perfil pode fazer.
          </p>
        </div>
      </div>
      <SubModuleControlList
        controlTree={control_tree}
        totalControlsOnModule={total_controls_on_module}
        profile={profile}
      />
    </div>
  );
}
