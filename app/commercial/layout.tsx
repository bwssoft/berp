"use client";

import { Layout } from "@/app/lib/@frontend/ui/component";
import { BriefcaseIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function ComercialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout navigation={navigation}>{children}</Layout>;
}

const navigation = [
  {
    name: "Clientes",
    pathname: "/commercial/client",
    code: "commercial:client",
    icon: BriefcaseIcon,
  },
  {
    name: "Propostas",
    pathname: "/commercial/proposal",
    code: "commercial:proposal",
    icon: DocumentTextIcon, // remete a contratos, propostas e documentos
  },
];
