// columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/app/lib/util";
import { IIdentificationLog } from "@/app/lib/@backend/domain";
import Link from "next/link";
import { Button } from '@/frontend/ui/component/button';

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { deviceConstants } from "@/app/lib/constant";

export interface Row extends IIdentificationLog {}

/** Estilos para o badge de status */
const statuses = {
  true: "text-green-500 bg-green-800/20",
  false: "text-rose-500 bg-rose-800/20",
};
const textColor = {
  true: "text-green-800",
  false: "text-rose-800",
};
const info = {
  true: "Sucesso",
  false: "Falha",
};

export const columns: ColumnDef<Row>[] = [
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const s = String(row.original.status) as keyof typeof statuses;
      return (
        <div className="flex items-center gap-1">
          <div className={cn(statuses[s], "flex-none rounded-full p-1 w-fit")}>
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
          <div className={cn("hidden font-semibold sm:block", textColor[s])}>
            {info[s]}
          </div>
        </div>
      );
    },
  },
  {
    header: "Serial",
    accessorKey: "equipment.serial",
    cell: ({ row }) => {
      const before = row.original.equipment_before.serial ?? "--";
      const after = row.original.equipment_after.serial ?? "--";

      return (
        <div className="flex flex-col">
          <span
            title={`Antes: ${before}`}
            className="text-sm text-muted-foreground"
          >
            {before}
          </span>
          <span title={`Depois: ${after}`} className="text-sm font-medium">
            {after}
          </span>
        </div>
      );
    },
  },
  {
    header: "Modelo",
    accessorKey: "technology.system_name",
    cell: ({ row }) => (
      <p title={row.original.technology.system_name}>
        {deviceConstants.model[row.original.technology.system_name] ?? "--"}
      </p>
    ),
  },
  {
    header: "Data",
    accessorKey: "created_at",
    cell: ({ row }) => <p>{row.original.created_at.toLocaleString()}</p>,
  },
  {
    header: "Ação",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <Link href={`/production/log/configurator/${original.id}`}>
          <Button variant="ghost">
            <ArrowTopRightOnSquareIcon aria-hidden="true" className="size-5" />
          </Button>
        </Link>
      );
    },
  },
];
