"use client";

import { Layout } from "@/app/lib/@frontend/ui/component";
import {
  AdjustmentsVerticalIcon,
  BriefcaseIcon,
  CircleStackIcon,
  ClipboardIcon,
  HomeIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../lib/@frontend/context";

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
];
