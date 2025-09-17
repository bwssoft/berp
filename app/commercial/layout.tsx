"use client";

import { Layout } from "@/app/lib/@frontend/ui/component";
import {
  BriefcaseIcon,
  Cog6ToothIcon,
  CubeIcon,
  DocumentTextIcon,
  TagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../lib/@frontend/context";
import { Package } from "lucide-react";

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
    name: "Contas",
    pathname: "/commercial/account",
    code: "commercial:accounts",
    icon: UserGroupIcon, // representa gestão de contas comerciais
  },
  {
    name: "Propostas",
    pathname: "/commercial/proposal",
    code: "commercial:proposal",
    icon: DocumentTextIcon, // remete a contratos, propostas e documentos
  },
  {
    name: "Produtos",
    pathname: "/commercial/product",
    code: "commercial:product",
    icon: Package, // Representa produtos físicos
    children: [
      {
        name: "Gestão",
        pathname: "/commercial/product/management",
        code: "commercial:product:view",
        icon: Cog6ToothIcon, // Gestão geral/configuração
      },
      {
        name: "Categorias",
        pathname: "/commercial/product/category",
        code: "commercial:product:category",
        icon: TagIcon, // Ícone clássico de categorização
      },
    ],
  },
  {
    name: "Tabela de Preços",
    pathname: "/commercial/price-table",
    code: "commercial:price-table:view",
    icon: CurrencyDollarIcon,
  },
];
