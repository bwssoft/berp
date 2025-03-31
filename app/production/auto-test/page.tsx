import { GridList } from "@/app/lib/@frontend/ui/component";
import {
  WrenchScrewdriverIcon, // Ferramenta de testes
  DocumentMagnifyingGlassIcon, // Log e inspeção
} from "@heroicons/react/24/outline";

const actions = [
  {
    title: "Auto Test",
    href: "/production/auto-test/tool",
    icon: WrenchScrewdriverIcon,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description:
      "Execute testes automatizados para validar o funcionamento dos dispositivos durante a produção.",
  },
  {
    title: "Log",
    href: "/production/auto-test/log",
    icon: DocumentMagnifyingGlassIcon,
    iconForeground: "text-slate-700",
    iconBackground: "bg-slate-50",
    description:
      "Consulte os registros de testes realizados, com detalhes técnicos e status de execução.",
  },
];

export default function Page() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Módulo Produção - Auto Test
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades do auto teste da
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
