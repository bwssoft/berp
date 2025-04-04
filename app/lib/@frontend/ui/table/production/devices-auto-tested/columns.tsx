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
  id: string;
  equipment: {
    imei: string;
    serial?: string;
    iccid?: string;
  };
  status: boolean;
  created_at: Date;
  technology: {
    system_name: string;
  };
}>[] = [
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const { original } = row;
      const status = original.status ? "success" : "error";
      const label = original.status ? "Sucesso" : "Falha";
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
    header: "Serial",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <p title={original.equipment.serial}>
          {original.equipment.serial ?? "--"}
        </p>
      );
    },
  },
  {
    header: "Imei",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const original = row.original;
      return (
        <p title={original.equipment.imei}>{original.equipment.imei ?? "--"}</p>
      );
    },
  },
  {
    header: "Iccid",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const original = row.original;
      return (
        <p title={original.equipment.iccid}>
          {original.equipment.iccid ?? "--"}
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
      const iput = row.original;
      return iput.created_at.toLocaleString();
    },
  },
  {
    header: "Ação",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <Link href={`/production/log/auto-test/${original.id}`}>
          <Button variant="ghost">
            <ArrowTopRightOnSquareIcon aria-hidden="true" className="size-5" />
          </Button>
        </Link>
      );
    },
  },
];
