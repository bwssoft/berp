"use client";

import { useAuth } from "@/app/lib/@frontend/context";
import { GridList } from "@/app/lib/@frontend/ui/component";
import {
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { CheckCheckIcon, FolderDownIcon } from "lucide-react";

const actions = [
  {
    title: "Auto Test",
    href: "/production/tool/auto-test",
    code: "production:tool:auto-test",
    icon: WrenchScrewdriverIcon,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description:
      "Execute testes automáticos para validar dispositivos durante o processo de produção.",
  },
  {
    title: "Configurador",
    href: "/production/tool/configurator",
    code: "production:tool:configurator",
    icon: Cog6ToothIcon,
    iconForeground: "text-amber-700",
    iconBackground: "bg-amber-50",
    description:
      "Configure parâmetros e definições técnicas dos dispositivos na linha de montagem.",
  },
  {
    title: "Identificador",
    href: "/production/tool/identificator",
    code: "production:tool:identifier",
    icon: IdentificationIcon,
    iconForeground: "text-cyan-700",
    iconBackground: "bg-cyan-50",
    description: "Grave identificações únicas nos dispositivos.",
  },
  {
    title: "Checagem",
    href: "/production/tool/check-configuration",
    code: "production:tool:check",
    icon: CheckCheckIcon,
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
    description: "Faça a checagem do perfil de configuração de equipamentos.",
  },
  {
    title: "Gravador de Firmware",
    href: "/production/tool/firmware-update",
    code: "production:tool:firmware-update",
    icon: FolderDownIcon,
    iconForeground: "text-orange-700",
    iconBackground: "bg-orange-50",
    description: "Inicie o processo de gravação de firmware.",
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
            Módulo Produção - Ferramentas
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades das ferramentas
            utilizadas pela Produção.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={actions} className="bg-unset" />
      </div>
    </div>
  );
}
