"use client";

import { Layout } from '@/frontend/layout/layout';

import { Warehouse, ArrowLeftRight, Boxes, Package } from "lucide-react";

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
    icon: Warehouse,
  },
  {
    name: "Movimentação",
    icon: ArrowLeftRight,
    pathname: "/logistic/movement",
    code: "logistic:movement",
  },
  {
    name: "Estoque",
    icon: Boxes,
    pathname: "/logistic/stock",
    code: "logistic:stock",
  },
  {
    name: "Itens",
    icon: Package,
    pathname: "/logistic/item",
    code: "logistic:item",
  },
];
