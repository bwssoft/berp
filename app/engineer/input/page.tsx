"use client";
import { useAuth } from "@/app/lib/@frontend/context";
import { GridList } from "@/app/lib/@frontend/ui/component";
import { Cog6ToothIcon, TagIcon } from "@heroicons/react/24/outline"; // ícones adequados para o contexto de inputes

const actions = [
  {
    title: "Gestão",
    href: "/engineer/input/management",
    code: "engineer:input",
    icon: Cog6ToothIcon, // Gestão geral/configuração
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
    description: "Gerencie os inputs utilizados no sistema.",
  },
  {
    title: "Categorias",
    href: "/engineer/input/category",
    code: "engineer:input:category",
    icon: TagIcon, // Ícone clássico de categorização
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
    description:
      "Organize os inputs em categorias para facilitar a visualização e controle.",
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
            Módulo Engenharia - Insumos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades de insumos para a
            Engenharia.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
