"use client";

import { Layout } from "@/app/lib/@frontend/ui/component";
import {
  AdjustmentsHorizontalIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  CpuChipIcon,
  CubeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../lib/@frontend/context";
import { Cpu, InspectionPanel, Wrench } from "lucide-react";

export default function EngineerLayout({
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
    name: "Comandos",
    pathname: "/engineer/command",
    code: "engineer:command",
    icon: ArrowPathIcon, // Representa ações/execução
    children: [
      {
        name: "Gestão",
        pathname: "/engineer/command/management",
        code: "engineer:command:view",
        icon: ClipboardDocumentCheckIcon, // Representa gerenciamento de tarefas/comandos
      },
      {
        name: "Agendamento",
        pathname: "/engineer/command/schedule",
        code: "engineer:command:schedule",
        icon: CalendarDaysIcon, // Ícone de calendário para agendamento
      },
    ],
  },
  {
    name: "Perfil de configuração",
    pathname: "/engineer/configuration-profile/management",
    code: "engineer:configuration-profile",
    icon: AdjustmentsHorizontalIcon, // Ajustes, configurações
  },
  {
    name: "Dispositivos",
    pathname: "/engineer/device/management",
    code: "engineer:device",
    icon: CpuChipIcon, // Representa hardware/dispositivos
  },
  {
    name: "Firmware",
    pathname: "/engineer/firmware",
    code: "engineer:firmware",
    icon: Cog6ToothIcon, // Representa atualização/sistema
    children: [
      {
        name: "Gestão",
        pathname: "/engineer/firmware/management",
        code: "engineer:firmware:view",
        icon: ClipboardDocumentCheckIcon, // Representa gerenciamento de tarefas/comandos
      },
      {
        name: "Acompanhamento",
        pathname: "/engineer/firmware/request-to-update",
        code: "engineer:firmware:request-to-update",
        icon: CalendarDaysIcon, // Ícone de calendário para agendamento
      },
    ],
  },
  {
    name: "Componentes",
    pathname: "/engineer/component",
    code: "engineer:component",
    icon: Cpu, // Representa estoque/insumos
    children: [
      {
        name: "Gestão",
        pathname: "/engineer/component/management",
        code: "engineer:component:view",
        icon: Cog6ToothIcon, // Gestão geral/configuração
      },
      {
        name: "Categorias",
        pathname: "/engineer/component/category",
        code: "engineer:component:category",
        icon: TagIcon, // Ícone clássico de categorização
      },
    ],
  },
  {
    name: "Insumos",
    pathname: "/engineer/input",
    code: "engineer:input",
    icon: Wrench, // Representa estoque/insumos
    children: [
      {
        name: "Gestão",
        pathname: "/engineer/input/management",
        code: "engineer:input:view",
        icon: Cog6ToothIcon, // Gestão geral/configuração
      },
      {
        name: "Categorias",
        pathname: "/engineer/input/category",
        code: "engineer:input:category",
        icon: TagIcon, // Ícone clássico de categorização
      },
    ],
  },
];
