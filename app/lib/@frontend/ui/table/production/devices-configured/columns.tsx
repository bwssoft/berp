"use client";

import { cn } from "@/app/lib/util";
import { ColumnDef } from "@tanstack/react-table";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../../../component";
import { ISerialPort } from "@/app/lib/@frontend/hook/use-serial-port";

const statuses = {
  progress: "text-gray-500 bg-gray-800/20",
  configured: "text-green-500 bg-green-800/20",
  error: "text-rose-500 bg-rose-800/20",
};

const text = {
  progress: "text-gray-800",
  configured: "text-green-800",
  error: "text-rose-800",
};

export const columns: ColumnDef<{
  id: string;
  port: ISerialPort;
  imei?: string;
  iccid?: string;
  is_configured: boolean;
  not_configured: any;
  profile_name: string;
  technology_id: string;
}>[] = [
  {
    header: "Configurado",
    accessorKey: "checked",
    cell: ({ row }) => {
      const device = row.original;
      const status = device.is_configured ? "configured" : "error";
      const label = device.is_configured ? "Configurado" : "Não Configurado";
      return (
        <div className="flex items-center gap-1">
          <div className={cn(statuses[status], "flex-none rounded-full p-1")}>
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
          <div className={cn("hidden font-semibold sm:block", text[status])}>
            {label}
          </div>
        </div>
      );
    },
  },
  {
    header: "Imei",
    accessorKey: "imei",
    cell: ({ row }) => {
      const device = row.original;
      return device.imei ?? "--";
    },
  },
  {
    header: "Iccid",
    accessorKey: "iccid",
    cell: ({ row }) => {
      const device = row.original;
      return <p title={device.iccid}>{device.iccid ?? "--"}</p>;
    },
  },
  {
    header: "Nome do perfil",
    accessorKey: "profile_name",
    cell: ({ row }) => {
      const device = row.original;
      return device.profile_name ?? "--";
    },
  },
  {
    header: "Ações",
    accessorKey: "port",
    cell: ({ row }) => {
      const configuration = row.original;
      const href = `/configurator/review?id=${configuration.id}`;
      return (
        <div className="flex gap-2">
          <Link href={href} target="_blank">
            <Button
              variant="outline"
              className="p-2"
              title="Verificar logs de configuração"
            >
              <DocumentMagnifyingGlassIcon
                width={16}
                height={16}
                title="Verificar logs de configuração"
              />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
