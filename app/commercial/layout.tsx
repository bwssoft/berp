"use client";

import { Layout } from "@/app/lib/@frontend/ui/component";
import {
  BriefcaseIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../lib/@frontend/context";

export default function ComercialLayout({
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
  {
    name: "Contas",
    pathname: "/commercial/account",
    code: "commercial:accounts",
    icon: UserGroupIcon, // representa gestão de contas comerciais
  },
];
