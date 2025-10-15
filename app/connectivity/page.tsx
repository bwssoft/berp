"use client";

import { GridList } from '@/frontend/ui/component/grid-list';

import { useAuth } from '@/frontend/context/auth.context';

import { Activity } from "lucide-react";

const actions = [
  {
    title: "Ativação LoRaWan",
    href: "/connectivity/lora-activation",
    code: "connectivity:lora-activation",
    icon: Activity,
    iconForeground: "text-orange-700",
    iconBackground: "bg-orange-50",
    description: "Gerencie a ativação de chaves LoRa.",
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
            Módulo Conectivade
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pela conectividade dos equipamentos IoT.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
