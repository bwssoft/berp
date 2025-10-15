"use client";
import {
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  CpuChipIcon,
  ArrowPathIcon,
  ArchiveBoxIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

import { GridList } from '@/frontend/ui/component/grid-list';

import { useAuth } from '@/frontend/context/auth.context';

import { Cpu, InspectionPanel, Wrench } from "lucide-react";

const actions = [
  {
    title: "Comandos",
    href: "/engineer/command",
    code: "engineer:command",
    icon: ArrowPathIcon, // Representa ações/execução
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description:
      "Gerencie os comandos enviados aos dispositivos em tempo real ou agendados.",
  },
  {
    title: "Perfil de configuração",
    href: "/engineer/configuration-profile/management",
    code: "engineer:configuration-profile",
    icon: AdjustmentsHorizontalIcon, // Ajustes, configurações
    iconForeground: "text-amber-700",
    iconBackground: "bg-amber-50",
    description:
      "Crie e gerencie perfis de configuração para padronizar o comportamento dos dispositivos.",
  },
  {
    title: "Dispositivos",
    href: "/engineer/device/management",
    code: "engineer:device",
    icon: CpuChipIcon, // Representa hardware/dispositivos
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description:
      "Acompanhe e administre os dispositivos conectados ao sistema.",
  },
  {
    title: "Firmware",
    href: "/engineer/firmware",
    code: "engineer:firmware",
    icon: Cog6ToothIcon, // Representa atualização/sistema
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
    description:
      "Gerencie as versões de firmware dos dispositivos e atualizações.",
  },
  {
    title: "Componentes",
    href: "/engineer/component",
    code: "engineer:component",
    icon: Cpu, // Representa estoque/insumos
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description: "Gerencie os componentes utilizados no sistema.",
  },
  {
    title: "Insumos",
    href: "/engineer/input/management",
    code: "engineer:input",
    icon: Wrench, // Representa produtos físicos
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
    description: "Visualize e gerencie os insumos da Engenharia.",
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
            Módulo Engenharia
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades de Engengaria.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
