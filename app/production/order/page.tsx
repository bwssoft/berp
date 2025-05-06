"use client";

import { useAuth } from "@/app/lib/@frontend/context";
import { GridList } from "@/app/lib/@frontend/ui/component";
import {
  ClipboardDocumentCheckIcon, // Gestão
  ChartBarIcon, // Dashboard
  ViewColumnsIcon, // Kanban
} from "@heroicons/react/24/outline";

const actions = [
  {
    title: "Gestão",
    href: "/production/order/management",
    code: "production:order:view",
    icon: ClipboardDocumentCheckIcon,
    iconForeground: "text-indigo-700",
    iconBackground: "bg-indigo-50",
    description:
      "Gerencie ordens de produção com controle detalhado de etapas, responsáveis e status.",
  },
  {
    title: "Dashboard",
    href: "/production/order/dashboard",
    code: "production:order:dashboard",
    icon: ChartBarIcon,
    iconForeground: "text-green-700",
    iconBackground: "bg-green-50",
    description:
      "Visualize indicadores, métricas e estatísticas sobre as ordens de produção em tempo real.",
  },
  {
    title: "Kanban",
    href: "/production/order/kanban",
    code: "production:order:kanban",
    icon: ViewColumnsIcon,
    iconForeground: "text-amber-700",
    iconBackground: "bg-amber-50",
    description:
      "Acompanhe visualmente o fluxo de produção por meio de um quadro Kanban interativo.",
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
            Módulo Produção - Ordem de produção
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades de ordem de produção
            da Produção.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
