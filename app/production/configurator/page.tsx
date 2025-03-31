import { GridList } from "@/app/lib/@frontend/ui/component";
import {
  DocumentMagnifyingGlassIcon,
  Cog6ToothIcon, // Log e inspeção
} from "@heroicons/react/24/outline";

const actions = [
  {
    title: "Configurador",
    href: "/production/configurator/tool",
    icon: Cog6ToothIcon,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description:
      "Configure parâmetros técnicos nos dispositivos conforme os requisitos da linha de produção.",
  },
  {
    title: "Log",
    href: "/production/configurator/log",
    icon: DocumentMagnifyingGlassIcon,
    iconForeground: "text-slate-700",
    iconBackground: "bg-slate-50",
    description:
      "Consulte os registros das configurações aplicadas e acompanhe seu histórico técnico.",
  },
];

export default function Page() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Módulo Produção - Configurador
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades do configurador da
            Produção.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={actions} className="bg-unset" />
      </div>
    </div>
  );
}
