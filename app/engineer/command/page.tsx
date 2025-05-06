"use client";
import { useAuth } from "@/app/lib/@frontend/context";
import { GridList } from "@/app/lib/@frontend/ui/component";
import {
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline"; // novos ícones com mais clareza semântica

const actions = [
  {
    title: "Gestão",
    href: "/engineer/command/management",
    code: "engineer:command",
    icon: ClipboardDocumentCheckIcon, // Representa gerenciamento de tarefas/comandos
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description:
      "Gerencie os comandos enviados aos dispositivos em tempo real ou agendados.",
  },
  {
    title: "Agendamento",
    href: "/engineer/command/schedule",
    code: "engineer:command-schedule",
    icon: CalendarDaysIcon, // Ícone de calendário para agendamento
    iconForeground: "text-emerald-700",
    iconBackground: "bg-emerald-50",
    description:
      "Programe o envio de comandos para execução automática em horários definidos.",
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
            Módulo Engenharia - Comandos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades de comandos para a
            Engenharia.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
