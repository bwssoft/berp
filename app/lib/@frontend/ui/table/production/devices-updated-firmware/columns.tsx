// columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/app/lib/util";
import { Device } from "@/app/lib/@backend/domain";
import Link from "next/link";
import { Button } from "../../../component";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export interface Row {
  id: string;
  equipment: {
    serial: string;
    firmware: string;
    lora_keys?: Partial<Device.Equipment["lora_keys"]>;
  };
  status: boolean;
  created_at: Date;
  technology: {
    system_name: Device.Model;
  };
}

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

/** Colunas comuns a todas as tecnologias */
const commonColumns: ColumnDef<Row>[] = [
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
    header: "Data",
    accessorKey: "created_at",
    cell: ({ row }) => <p>{row.original.created_at.toLocaleString()}</p>,
  },
];

/** Colunas específicas por tipo de dispositivo */
const columnMap: Partial<Record<Device.Model, ColumnDef<Row>[]>> = {
  DM_E3_PLUS_4G: [
    {
      header: "Serial",
      accessorKey: "equipment.serial",
      cell: ({ row }) => (
        <p title={row.original.equipment.serial}>
          {row.original.equipment.serial ?? "--"}
        </p>
      ),
    },
    {
      header: "Firmware",
      accessorKey: "equipment.firmware",
      cell: ({ row }) => (
        <p title={row.original.equipment.firmware}>
          {row.original.equipment.firmware ?? "--"}
        </p>
      ),
    },
  ],
  DM_BWS_NB2: [
    {
      header: "Serial",
      accessorKey: "equipment.serial",
      cell: ({ row }) => (
        <p title={row.original.equipment.serial}>
          {row.original.equipment.serial ?? "--"}
        </p>
      ),
    },
    {
      header: "Firmware",
      accessorKey: "equipment.firmware",
      cell: ({ row }) => (
        <p title={row.original.equipment.firmware}>
          {row.original.equipment.firmware ?? "--"}
        </p>
      ),
    },
  ],
  DM_BWS_LORA: [
    {
      header: "Serial",
      accessorKey: "equipment.serial",
      cell: ({ row }) => (
        <p title={row.original.equipment.serial}>
          {row.original.equipment.serial ?? "--"}
        </p>
      ),
    },
    {
      header: "Firmware",
      accessorKey: "equipment.firmware",
      cell: ({ row }) => (
        <p title={row.original.equipment.firmware}>
          {row.original.equipment.firmware ?? "--"}
        </p>
      ),
    },
    {
      header: "Timestamp",
      accessorKey: "equipment.lora_keys.timestamp",
      cell: ({ row }) => (
        <p title={row.original.equipment.lora_keys?.timestamp}>
          {row.original.equipment.lora_keys?.timestamp ?? "--"}
        </p>
      ),
    },
    {
      header: "Device EUI",
      accessorKey: "equipment.lora_keys.device_eui",
      cell: ({ row }) => (
        <p title={row.original.equipment.lora_keys?.device_eui}>
          {row.original.equipment.lora_keys?.device_eui ?? "--"}
        </p>
      ),
    },
  ],
  DM_BWS_NB2_LORA: [
    {
      header: "Serial",
      accessorKey: "equipment.serial",
      cell: ({ row }) => (
        <p title={row.original.equipment.serial}>
          {row.original.equipment.serial ?? "--"}
        </p>
      ),
    },
    {
      header: "Device Address",
      accessorKey: "equipment.lora_keys.device_address",
      cell: ({ row }) => (
        <p title={row.original.equipment.lora_keys?.device_address}>
          {row.original.equipment.lora_keys?.device_address ?? "--"}
        </p>
      ),
    },
    {
      header: "Device EUI",
      accessorKey: "equipment.lora_keys.device_eui",
      cell: ({ row }) => (
        <p title={row.original.equipment.lora_keys?.device_eui}>
          {row.original.equipment.lora_keys?.device_eui ?? "--"}
        </p>
      ),
    },
    {
      header: "Firmware",
      accessorKey: "equipment.firmware",
      cell: ({ row }) => (
        <p title={row.original.equipment.firmware}>
          {row.original.equipment.firmware ?? "--"}
        </p>
      ),
    },
  ],
};

/**
 * Retorna o conjunto de colunas para o tipo de Device.Model informado.
 */
export function getColumns(type: Device.Model): ColumnDef<Row>[] {
  return [
    ...commonColumns,
    ...(columnMap[type] || []),
    {
      header: "Ação",
      accessorKey: "equipment",
      cell: ({ row }) => {
        const { original } = row;
        return (
          <Link
            href={`/production/log/firmware-update/${original.id}`}
            target="_blank"
          >
            <Button variant="ghost">
              <ArrowTopRightOnSquareIcon
                aria-hidden="true"
                className="size-5"
              />
            </Button>
          </Link>
        );
      },
    },
  ];
}
