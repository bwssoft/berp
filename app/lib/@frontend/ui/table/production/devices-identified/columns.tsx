"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/app/lib/util";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

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
  before: {
    imei: string;
    serial?: string;
  };
  after?: {
    imei?: string;
    serial?: string;
  };
  status: boolean;
  id: string;
  created_at: Date;
}>[] = [
  {
    header: "Configurado",
    accessorKey: "checked",
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
    accessorKey: "after",
    cell: ({ row }) => {
      const device = row.original;
      return <p title={device.after?.serial}>{device.after?.serial ?? "--"}</p>;
    },
  },
  {
    header: "Antes",
    accessorKey: "before",
    cell: ({ row }) => {
      const device = row.original;
      return (
        <p title={device.before?.serial}>{device.before?.serial ?? "--"}</p>
      );
    },
  },
  {
    header: "Criado em",
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
        <Link
          href={`/production/id-writter/log/${original.id}`}
          className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ArrowTopRightOnSquareIcon
            aria-hidden="true"
            className="-ml-0.5 size-5"
          />
        </Link>
      );
    },
  },
];
