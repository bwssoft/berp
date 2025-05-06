"use client";

import { Layout } from "@/app/lib/@frontend/ui/component";
import {
  BookOpenIcon,
  UsersIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../lib/@frontend/context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navigationByProfile } = useAuth();
  const options = navigationByProfile(navigation);
  return <Layout navigation={options}>{children}</Layout>;
}

const navigation: any[] = [
  {
    name: "Usuários",
    icon: UsersIcon,
    pathname: "/admin/user",
    code: "admin:user",
  },
  {
    name: "Perfis",
    icon: BookOpenIcon,
    pathname: "/admin/profile",
    code: "admin:profile",
  },
  {
    name: "Controle de acesso",
    icon: ViewColumnsIcon,
    pathname: "/admin/control",
    code: "admin:control",
  },
];
