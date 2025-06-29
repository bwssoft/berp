"use client";

import { GridList } from "../lib/@frontend/ui/component";
import { useAuth } from "../lib/@frontend/context";
import { Warehouse, ArrowLeftRight, Boxes, Package } from "lucide-react";

const actions = [
  {
    title: "Bases",
    href: "/logistic/base",
    code: "logistic:base",
    icon: Warehouse,
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description: "Gerencie as bases cadastradas no sistema.",
  },
  {
    title: "Movimentação",
    href: "/logistic/movement",
    code: "logistic:movement",
    icon: ArrowLeftRight,
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
    description: "Registre as movimentações no sistema.",
  },
  {
    title: "Estoque",
    href: "/logistic/stock",
    code: "logistic:stock",
    icon: Boxes,
    iconForeground: "text-green-700",
    iconBackground: "bg-green-50",
    description: "Acompanhe e gerencie o estoque disponível.",
  },
  {
    title: "Itens",
    href: "/logistic/item",
    code: "logistic:item",
    icon: Package,
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
    description: "Gerencie os itens cadastrados no sistema.",
  },
];

export default function Page() {
  const { navigationByProfile } = useAuth();
  // const options = navigationByProfile(actions);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Módulo Logística
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades da Logística.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={actions} className="bg-unset" />
      </div>
    </div>
  );
}
