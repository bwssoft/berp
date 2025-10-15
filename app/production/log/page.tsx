"use client";

import { useAuth } from '@/frontend/context/auth.context';

import { GridList } from '@/frontend/ui/component/grid-list';

import {
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { FolderDownIcon } from "lucide-react";

const actions = [
  {
    title: "Auto Test",
    href: "/production/log/auto-test",
    code: "production:log:auto-test",
    icon: WrenchScrewdriverIcon,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description: "Acessar e verificar o resultado do processo de auto teste",
  },
  {
    title: "Configurador",
    href: "/production/log/configurator",
    code: "production:log:configurator",
    icon: Cog6ToothIcon,
    iconForeground: "text-amber-700",
    iconBackground: "bg-amber-50",
    description: "Acessar e verificar o resultado do processo de configuração",
  },
  {
    title: "Identificador",
    href: "/production/log/identificator",
    code: "production:log:identifier",
    icon: IdentificationIcon,
    iconForeground: "text-cyan-700",
    iconBackground: "bg-cyan-50",
    description:
      "Acessar e verificar o resultado do processo de identificação do equipamento.",
  },
  {
    title: "Gravador de Firmware",
    href: "/production/log/firmware-update",
    code: "production:log:firmware-update",
    icon: FolderDownIcon,
    iconForeground: "text-orange-700",
    iconBackground: "bg-orange-50",
    description:
      "Acessar e verificar o resultado do processo de gravação de firmware.",
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
            Módulo Produção - Logs
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável por apresentar os logs gerados pelas
            ferramentas utilizadas pela Produção.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={actions} className="bg-unset" />
      </div>
    </div>
  );
}
