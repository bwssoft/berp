import { GridList } from "@/app/lib/@frontend/ui/component";
import {
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

const actions = [
  {
    title: "Auto Test",
    href: "/production/log/auto-test",
    code: "production:auto-test-log",
    icon: WrenchScrewdriverIcon,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description: "Acessar e verificar o resultado do processo de auto teste",
  },
  {
    title: "Configurador",
    href: "/production/log/configurator",
    code: "production:configuration-log",
    icon: Cog6ToothIcon,
    iconForeground: "text-amber-700",
    iconBackground: "bg-amber-50",
    description: "Acessar e verificar o resultado do processo de configuração",
  },
  {
    title: "Identificador",
    href: "/production/log/identificator",
    code: "production:device-identification-log",
    icon: IdentificationIcon,
    iconForeground: "text-cyan-700",
    iconBackground: "bg-cyan-50",
    description:
      "Acessar e verificar o resultado do processo de identificação do equipamento.",
  },
];

export default function Page() {
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
