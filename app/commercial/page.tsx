import { BriefcaseIcon, DocumentTextIcon } from "@heroicons/react/24/outline"; // ícones alinhados ao contexto comercial

import { GridList } from "../lib/@frontend/ui/component";

const actions = [
  {
    title: "Clientes",
    href: "/commercial/client",
    icon: BriefcaseIcon, // representa claramente clientes/relacionamentos
    iconForeground: "text-sky-700",
    iconBackground: "bg-sky-50",
    description:
      "Gerencie os dados dos seus clientes e mantenha o histórico de interações comerciais.",
  },
  {
    title: "Propostas",
    href: "/commercial/proposal",
    icon: DocumentTextIcon, // remete a contratos, propostas e documentos
    iconForeground: "text-lime-700",
    iconBackground: "bg-lime-50",
    description:
      "Crie, edite e acompanhe propostas comerciais de forma organizada.",
  },
];

export default function Page() {
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
        <GridList actions={actions} className="bg-unset" />
      </div>
    </div>
  );
}
