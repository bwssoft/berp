import {
  findManyControl,
  findOneControl,
  findOneProfile,
} from "@/app/lib/@backend/action";
import { buildControlTree, cn, ControlTree } from "@/app/lib/util";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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

  const [profile, controls] = await Promise.all([
    findOneProfile({ id: slug[1] }),
    findManyControl({ parent_code: { $regex: control.code, $options: "i" } }),
  ]);

  const control_tree = buildControlTree(controls);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Controle de Acesso - {control.name} - {profile?.name ?? ""}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Tela para o gerenciamento de acessos que cada perfil pode fazer.
          </p>
        </div>
      </div>
      <ul
        role="list"
        className="mt-10 px-4 sm:px-6 lg:px-8 flex flex-col space-y-2"
      >
        {control_tree.map((control, index) => (
          <li
            key={control.id + index}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
          >
            {renderControlTree(control)}
          </li>
        ))}
      </ul>
    </div>
  );
}

//ACORDION BSOFT

const renderControlTree = (control: ControlTree[number]) => {
  const has_children = control.children.length > 0;
  return (
    <Disclosure key={control.id}>
      <DisclosureButton className="w-full p-6 group flex justify-between  items-center gap-2">
        {control.name}
        {has_children ? (
          <ChevronDownIcon className="w-5 group-data-[open]:rotate-180 text-right" />
        ) : (
          <></>
        )}
      </DisclosureButton>
      {has_children ? (
        <div>
          <DisclosurePanel className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0">
            {control.children.map((c) => renderControlTree(c))}
          </DisclosurePanel>
        </div>
      ) : (
        <></>
      )}
    </Disclosure>
  );
};
