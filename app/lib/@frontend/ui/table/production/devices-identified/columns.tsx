"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/app/lib/util";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../component";
import { technologyConstants } from "@/app/lib/constant";

const statuses = {
  progress: "text-gray-500 bg-gray-800/20",
  success: "text-green-500 bg-green-800/20",
  error: "text-rose-500 bg-rose-800/20",
};

const text = {
  progress: "text-gray-800",
  success: "text-green-800",
  error: "text-rose-800",
};
export const columns: ColumnDef<{
  equipment: {
    imei: string;
    serial?: string;
  };
  identification?: {
    imei?: string;
    serial?: string;
  };
  status: boolean;
  id: string;
  created_at: Date;
  technology: {
    system_name: string;
  };
}>[] = [
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const device = row.original;
      const status = device.status ? "success" : "error";
      const label = device.status ? "Sucesso" : "Falha";
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
    header: "Atual",
    accessorKey: "identification",
    cell: ({ row }) => {
      const device = row.original;
      return (
        <p title={device.identification?.serial}>
          {device.identification?.serial ?? "--"}
        </p>
      );
    },
  },
  {
    header: "Antes",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const device = row.original;
      return (
        <p title={device.equipment?.serial}>
          {device.equipment?.serial ?? "--"}
        </p>
      );
    },
  },
  {
    header: "Tecnologia",
    accessorKey: "technology",
    cell: ({ row }) => {
      const { original } = row;
      return (
        technologyConstants.name[
          original.technology
            .system_name as keyof typeof technologyConstants.name
        ] ?? "Unknown"
      );
    },
  },
  {
    header: "Data de criação",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const { original } = row;
      return original.created_at.toLocaleString();
    },
  },
  {
    header: "Ação",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <Link href={`/production/log/identificator/${original.id}`}>
          <Button variant="ghost">
            <ArrowTopRightOnSquareIcon aria-hidden="true" className="size-5" />
          </Button>
        </Link>
      );
    },
  },
];
