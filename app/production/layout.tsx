"use client";

import { Layout } from "@/app/lib/@frontend/ui/component";
import {
  WrenchScrewdriverIcon, // Auto Test
  Cog6ToothIcon, // Configurador
  IdentificationIcon, // Identificador
  ClipboardDocumentListIcon, // Ordem de Produção
  BuildingLibraryIcon,
  DocumentArrowDownIcon,
  WrenchIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  ViewColumnsIcon, // Processo Produtivo
} from "@heroicons/react/24/outline";

export default function ProductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout navigation={navigation}>{children}</Layout>;
}

const navigation = [
  {
    name: "Ordem de Produção",
    pathname: "/production/order",
    code: "production:order",
    icon: ClipboardDocumentListIcon,
    children: [
      {
        name: "Gestão",
        pathname: "/production/order/management",
        icon: ClipboardDocumentCheckIcon,
      },
      {
        name: "Dashboard",
        pathname: "/production/order/dashboard",
        icon: ChartBarIcon,
      },
      {
        name: "Kanban",
        pathname: "/production/order/kanban",
        icon: ViewColumnsIcon,
      },
    ],
  },
  {
    name: "Ferramentas",
    icon: WrenchScrewdriverIcon,
    pathname: "/production/tool",
    children: [
      {
        name: "Auto Test",
        pathname: "/production/tool/auto-test",
        code: "production:auto-test",
        icon: WrenchIcon,
      },
      {
        name: "Configurador",
        pathname: "/production/tool/configurator",
        code: "production:configurator",
        icon: Cog6ToothIcon,
      },
      {
        name: "Identificador",
        pathname: "/production/tool/identificator",
        code: "production:identificator",
        icon: IdentificationIcon,
      },
    ],
  },
  {
    name: "Logs",
    icon: DocumentArrowDownIcon,
    pathname: "/production/log",
    children: [
      {
        name: "Auto Test",
        pathname: "/production/log/auto-test",
        code: "production:auto-test",
        icon: WrenchIcon,
      },
      {
        name: "Configurador",
        pathname: "/production/log/configurator",
        code: "production:configurator",
        icon: Cog6ToothIcon,
      },
      {
        name: "Identificador",
        pathname: "/production/log/identificator",
        code: "production:identificator",
        icon: IdentificationIcon,
      },
    ],
  },
  {
    name: "Processo Produtivo",
    pathname: "/production/process/management",
    code: "production:process",
    icon: BuildingLibraryIcon,
  },
];
