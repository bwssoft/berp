"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/app/lib/util";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../component";
import { deviceConstants } from "@/app/lib/constant";
import { Device } from "@/app/lib/@backend/domain";

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
  equipment_before: {
    serial: string;
    imei?: string;
  };
  equipment_after?: {
    imei?: string;
    serial?: string;
  };
  status: boolean;
  created_at: Date;
  technology: {
    system_name: Device.Model;
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
    header: "Antes",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <p title={original.equipment_before.serial}>
          {original.equipment_before.serial ?? "--"}
        </p>
      );
    },
  },
  {
    header: "Depois",
    accessorKey: "equipment",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <p title={original?.equipment_after?.serial}>
          {original?.equipment_after?.serial ?? "--"}
        </p>
      );
    },
  },
  {
    header: "Tecnologia",
    accessorKey: "technology",
    cell: ({ row }) => {
      const { original } = row;
      return deviceConstants.model[original.technology.system_name] ?? "--";
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
        <Link href={`/production/log/identificator/${original.id}`}>
          <Button variant="ghost">
            <ArrowTopRightOnSquareIcon aria-hidden="true" className="size-5" />
          </Button>
        </Link>
      );
    },
  },
];
