"use client";

import { Layout } from '@/frontend/layout/layout';

import { useAuth } from '@/frontend/context/auth.context';

import { Activity } from "lucide-react";

export default function ConnectivityLayout({
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
    name: "Ativação LoRaWan",
    icon: Activity,
    pathname: "/connectivity/lora-activation",
    code: "connectivity:lora-activation",
  },
];
