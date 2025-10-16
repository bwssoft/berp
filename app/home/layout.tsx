"use client";

import { Layout } from '@/frontend/layout/layout';

import {
  AdjustmentsVerticalIcon,
  BriefcaseIcon,
  CircleStackIcon,
  ClipboardIcon,
  HomeIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from '@/frontend/context/auth.context';

import { Network } from "lucide-react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navigationByProfile } = useAuth();
  const options = navigationByProfile(navigation);
  return <Layout navigation={options}>{children}</Layout>;
}

const navigation = [
  { name: "Home", icon: HomeIcon, pathname: "/home", code: "home" },
  {
    name: "Admin",
    icon: AdjustmentsVerticalIcon,
    pathname: "/admin",
    code: "admin",
  },
  {
    name: "Engenharia",
    icon: RectangleStackIcon,
    pathname: "/engineer",
    code: "engineer",
  },
  {
    name: "Produção",
    icon: ClipboardIcon,
    pathname: "/production",
    code: "production",
  },
  {
    name: "Comercial",
    icon: BriefcaseIcon,
    pathname: "/commercial",
    code: "commercial",
  },
  {
    name: "Logistica",
    icon: CircleStackIcon,
    pathname: "/logistic",
    code: "logistic",
  },
  {
    name: "Conectividade",
    icon: Network,
    pathname: "/connectivity",
    code: "connectivity",
  },
];
