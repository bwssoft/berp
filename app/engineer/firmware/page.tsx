"use client";
import { useAuth } from "@/app/lib/@frontend/context";
import { GridList } from "@/app/lib/@frontend/ui/component";
import { Cog6ToothIcon, EyeIcon } from "@heroicons/react/24/outline"; // ícones específicos para firmware e monitoramento

const actions = [
  {
    title: "Gestão",
    href: "/engineer/firmware/management",
    code: "engineer:firmware",
    icon: Cog6ToothIcon, // engrenagem remete a sistema, atualização e configuração
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
    description:
      "Gerencie as versões de firmware dos dispositivos e coordene atualizações.",
  },
  {
    title: "Acompanhamento",
    href: "/engineer/firmware/request-to-update",
    code: "engineer:firmware:requisicoes-atualizacao",
    icon: EyeIcon, // representa visualização e monitoramento
    iconForeground: "text-emerald-700",
    iconBackground: "bg-emerald-50",
    description:
      "Acompanhe as solicitações de atualização de firmware e seus status em tempo real.",
  },
];

export default function Page() {
  const { navigationByProfile} = useAuth();
  const options = navigationByProfile(actions);
  
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Módulo Engenharia - Firmware
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades de firmware para a
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
