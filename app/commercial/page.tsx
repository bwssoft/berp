"use client";

import {
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline"; // ícones alinhados ao contexto comercial
import { GridList } from "../lib/@frontend/ui/component";
import { useAuth } from "../lib/@frontend/context";
import { Package } from "lucide-react";

const actions = [
  {
    title: "Contas",
    href: "/commercial/account",
    code: "commercial:accounts",
    icon: UserGroupIcon, // representa gestão de contas comerciais
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
    description:
      "Gerencie contas comerciais e seus anexos de forma centralizada.",
  },
  {
    title: "Propostas",
    href: "/commercial/proposal",
    code: "commercial:proposal",
    icon: DocumentTextIcon, // remete a contratos, propostas e documentos
    iconForeground: "text-lime-700",
    iconBackground: "bg-lime-50",
    description:
      "Crie, edite e acompanhe propostas comerciais de forma organizada.",
  },
  {
    title: "Produtos",
    href: "/commercial/product",
    code: "commercial:product",
    icon: Package, // remete a contratos, propostas e documentos
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
    description: "Crie, edite e acompanhe produtos.",
  },
  {
    title: "Tabela de Preços",
    href: "/commercial/price-table",
    code: "commercial:price-table:view",
    icon: CurrencyDollarIcon,
    iconForeground: "text-green-700",
    iconBackground: "bg-green-50",
    description: "Gerencie tabelas de preços e valores comerciais.",
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
            Módulo Comercial
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades do Comercial.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
