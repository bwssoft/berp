import {
  WrenchScrewdriverIcon, // Auto Test
  ClipboardDocumentListIcon, // Ordem de Produção
  BuildingLibraryIcon,
  DocumentArrowDownIcon, // Processo Produtivo
} from "@heroicons/react/24/outline";

import { GridList } from "../lib/@frontend/ui/component";
import { useAuth } from "../lib/@frontend/context";

const actions = [
  {
    title: "Ferramentas",
    href: "/production/tool",
    code: "production:tool",
    icon: WrenchScrewdriverIcon,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description:
      "Execute testes automáticos para validar dispositivos durante o processo de produção.",
  },
  {
    title: "Logs",
    href: "/production/log",
    icon: DocumentArrowDownIcon,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    code: "production:log",
    description:
      "Visualize/Analise os resultados da utilização das ferramentas.",
  },
  {
    title: "Ordem de Produção",
    href: "/production/order",
    code: "production:order",
    icon: ClipboardDocumentListIcon,
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
    description:
      "Crie, acompanhe e organize ordens de produção com informações detalhadas.",
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
            Módulo Produção
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades da Produção.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
