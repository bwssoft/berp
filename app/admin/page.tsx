import {
  ViewColumnsIcon,
  BookOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { GridList } from "../lib/@frontend/ui/component";

const actions = [
  {
    title: "Usuários",
    href: "/admin/user",
    icon: UsersIcon,
    iconForeground: "text-sky-700",
    iconBackground: "bg-sky-50",
    description:
      "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.",
  },
  {
    title: "Perfil",
    href: "/admin/profile",
    icon: BookOpenIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description:
      "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.",
  },
  {
    title: "Controle de acesso",
    href: "/admin/control",
    icon: ViewColumnsIcon,
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
    description:
      "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.",
  },
];

export default function Page() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Módulo Admin
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelo controle de acesso, usuários e
            perfis.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={actions} className="bg-unset" />
      </div>
    </div>
  );
}
