"use client";

import { useAuth } from '@/frontend/context/auth.context';

import { GridList } from '@/frontend/ui/component/grid-list';

import { Cog6ToothIcon, TagIcon } from "@heroicons/react/24/outline"; // ícones adequados para o contexto de produtos

const actions = [
  {
    title: "Gestão",
    href: "/commercial/product/management",
    code: "commercial:product",
    icon: Cog6ToothIcon, // Gestão geral/configuração
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
    description:
      "Gerencie os produtos utilizados no sistema e configure regras específicas.",
  },
  {
    title: "Categorias",
    href: "/commercial/product/category",
    code: "commercial:product:category",
    icon: TagIcon, // Ícone clássico de categorização
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
    description:
      "Organize os produtos em categorias para facilitar a visualização e controle.",
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
            Módulo Comercial - Produtos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades de produtos para o
            Comercial.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
