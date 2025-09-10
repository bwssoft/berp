"use client";

import { Button } from "@/app/lib/@frontend/ui/component";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, History, Pencil } from "lucide-react";
import { IPriceTable } from "@/app/lib/@backend/domain/commercial/entity/price-table.definition";

const getStatusDisplayText = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Ativa";
    case "INACTIVE":
      return "Inativa";
    case "CANCELLED":
      return "Cancelada";
    case "AWAITING_PUBLICATION":
      return "Aguardando Publicação";
    case "SCHEDULED_FOR_PUBLICATION":
      return "Tabela Programada para Publicação";
    case "DRAFT":
      return "Rascunho";
    default:
      return status; // fallback to original value
  }
};

const getStatusColor = (status: string) => {
  // Use display text for color mapping
  const displayText = getStatusDisplayText(status);
  switch (displayText) {
    case "Ativa":
      return "bg-green-100 text-green-800";
    case "Em Pausa":
      return "bg-purple-100 text-purple-800";
    case "Rascunho":
      return "bg-blue-100 text-blue-800";
    case "Aguardando Publicação":
      return "bg-yellow-100 text-yellow-800";
    case "Inativa":
      return "bg-red-100 text-red-800";
    case "Cancelada":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const columns: ColumnDef<IPriceTable>[] = [
  {
    accessorKey: "name",
    header: "NOME DA TABELA",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "DATA DE CADASTRO",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return (
        <div>
          {date
            ? new Date(date).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "startDateTime",
    header: "DATA INICIAL",
    cell: ({ row }) => {
      const date = row.getValue("startDateTime") as Date;
      return (
        <div>
          {date
            ? new Date(date).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "endDateTime",
    header: "DATA FINAL",
    cell: ({ row }) => {
      const date = row.getValue("endDateTime") as Date;
      return (
        <div>
          {date
            ? new Date(date).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "isTemporary",
    header: "TIPO",
    cell: ({ row }) => {
      const isTemporary = row.getValue("isTemporary") as boolean;
      return <div>{isTemporary ? "Provisória" : "Normal"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const displayText = getStatusDisplayText(status);
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          {displayText}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "AÇÃO",
    cell: ({ row, table }) => {
      const { restrictEdit } = table.options.meta as { restrictEdit: boolean };
      return (
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          title="Histórico"
        >
          <History className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          title="Clonar tabela"
        >
          <Copy className="h-4 w-4" />
        </Button>
        {restrictEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    )},
  },
];
