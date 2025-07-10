"use client";

import {
  ViewColumnsIcon,
  BookOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { GridList } from "../lib/@frontend/ui/component";
import { useAuth } from "../lib/@frontend/context";

const actions = [
  {
    title: "Usuários",
    href: "/admin/user",
    code: "admin:user",
    icon: UsersIcon,
    iconForeground: "text-sky-700",
    iconBackground: "bg-sky-50",
    description:
        "Gerencie o cadastro, edição e exclusão de usuários do sistema, além de visualizar seus detalhes e status de acesso.",
  },
  {
    title: "Perfil",
    href: "/admin/profile",
    code: "admin:profile",
    icon: BookOpenIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description:
       "Configure perfis de acesso, definindo permissões e regras específicas para diferentes grupos de usuários.",
  },
  {
    title: "Controle de acesso",
    href: "/admin/control",
    code: "admin:control",
    icon: ViewColumnsIcon,
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
    description:
       "Administre as regras de autorização do sistema, vinculando usuários e perfis às funcionalidades disponíveis.",
  },
];

export default function Page() {
  const { navigationByProfile } = useAuth();
  const options = navigationByProfile(actions);
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
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
