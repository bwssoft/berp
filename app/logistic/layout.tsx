"use client";

import { Layout } from "@/app/lib/@frontend/ui/component";
import {
  WrenchScrewdriverIcon, // Auto Test
  BuildingStorefrontIcon, // Ordem de Produção
} from "@heroicons/react/24/outline";

export default function ProductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout navigation={navigation}>{children}</Layout>;
}

const navigation = [
  {
    name: "Bases",
    code: "logistic:base",
    pathname: "/logistic/base",
    icon: BuildingStorefrontIcon,
  },
  {
    name: "Movimentação",
    icon: WrenchScrewdriverIcon,
    pathname: "/logistic/movement",
    code: "logistic:movement",
  },
  {
    name: "Estoque",
    icon: WrenchScrewdriverIcon,
    pathname: "/logistic/stock",
    code: "logistic:stock",
  },
];
