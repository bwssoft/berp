import { GridList } from "@/app/lib/@frontend/ui/component";
import {
  DocumentMagnifyingGlassIcon,
  IdentificationIcon, // Ícone semântico para o identificador
} from "@heroicons/react/24/outline";

const actions = [
  {
    title: "Identificador",
    href: "/production/id-writer/tool",
    icon: IdentificationIcon,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description:
      "Grave identificações únicas nos dispositivos conforme os padrões da produção.",
  },
  {
    title: "Log",
    href: "/production/id-writer/log",
    icon: DocumentMagnifyingGlassIcon,
    iconForeground: "text-slate-700",
    iconBackground: "bg-slate-50",
    description:
      "Consulte os registros das gravações realizadas, com histórico técnico detalhado.",
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
            Esse módulo é responsável pelas funcionalidades do identificador da
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
