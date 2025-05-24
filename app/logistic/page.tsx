"use client";

import {
  WrenchScrewdriverIcon, // Auto Test
  ClipboardDocumentListIcon, // Ordem de Produção
  DocumentArrowDownIcon,
  BuildingOfficeIcon, // Processo Produtivo
} from "@heroicons/react/24/outline";

import { GridList } from "../lib/@frontend/ui/component";
import { useAuth } from "../lib/@frontend/context";

const actions = [
  {
    title: "Bases",
    href: "/logistic/base",
    code: "logistic:base",
    icon: BuildingOfficeIcon,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description: "Gerencie as bases cadastradas no sistema.",
  },
];

export default function Page() {
  const { navigationByProfile } = useAuth();
  // const options = navigationByProfile(actions);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Módulo Logística
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades da Logística.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={actions} className="bg-unset" />
      </div>
    </div>
  );
}
