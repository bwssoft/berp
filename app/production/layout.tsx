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
import { useAuth } from "../lib/@frontend/context";

export default function ProductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navigationByProfile } = useAuth();
  const options = navigationByProfile(navigation);
  return <Layout navigation={options}>{children}</Layout>;
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
        code: "production:order:view",
        icon: ClipboardDocumentCheckIcon,
      },
      {
        name: "Dashboard",
        pathname: "/production/order/dashboard",
        code: "production:order:dashboard",
        icon: ChartBarIcon,
      },
      {
        name: "Kanban",
        pathname: "/production/order/kanban",
        code: "production:order:kanban",
        icon: ViewColumnsIcon,
      },
      {
        name: "Processo Produtivo",
        pathname: "/production/process/management",
        code: "production:order:process",
        icon: BuildingLibraryIcon,
      },
    ],
  },
  {
    name: "Ferramentas",
    icon: WrenchScrewdriverIcon,
    pathname: "/production/tool",
    code: "production:tool",
    children: [
      {
        name: "Auto Test",
        pathname: "/production/tool/auto-test",
        code: "production:tool:auto-test",
        icon: WrenchIcon,
      },
      {
        name: "Configurador",
        pathname: "/production/tool/configurator",
        code: "production:tool:configurator",
        icon: Cog6ToothIcon,
      },
      {
        name: "Identificador",
        pathname: "/production/tool/identificator",
        code: "production:tool:identifier",
        icon: IdentificationIcon,
      },
    ],
  },
  {
    name: "Logs",
    icon: DocumentArrowDownIcon,
    pathname: "/production/log",
    code: "production:logs",
    children: [
      {
        name: "Auto Test",
        pathname: "/production/log/auto-test",
        code: "production:logs:auto-test",
        icon: WrenchIcon,
      },
      {
        name: "Configurador",
        pathname: "/production/log/configurator",
        code: "production:logs:configurator",
        icon: Cog6ToothIcon,
      },
      {
        name: "Identificador",
        pathname: "/production/log/identificator",
        code: "production:logs:identificator",
        icon: IdentificationIcon,
      },
    ],
  },
];
