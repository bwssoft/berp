"use-client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../component";
import { IMovement, Movement } from "@/app/lib/@backend/domain";
import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Badge } from "../../../component/badge";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CalendarDays,
  CheckCircle2,
  Clock,
  Cpu,
  Package,
  Wrench,
} from "lucide-react";
import { confirmManyMovement } from "@/app/lib/@backend/action";

interface Props {
  restrictFeatureByProfile: (code: string) => boolean;
}

export const columns = (props: Props): ColumnDef<IMovement>[] => [
  {
    header: "Sequencial",
    accessorKey: "seq",
    cell: ({
      row: {
        original: { seq },
      },
    }) => "MOV" + seq.toString().padStart(3, "0"),
  },
  {
    header: "Item",
    accessorKey: "item",
    cell: ({
      row: {
        original: { item },
      },
    }) => (
      <div className="flex items-center gap-2">
        {getTypeBadge(item.type)}
        <span>{item.ref.sku}</span>
      </div>
    ),
  },
  {
    header: "Qtd",
    accessorKey: "quantity",
    cell: ({
      row: {
        original: { quantity },
      },
    }) => quantity,
  },
  {
    header: "Tipo",
    accessorKey: "type",
    cell: ({
      row: {
        original: { type },
      },
    }) => (
      <Badge
        variant="outline"
        className={
          Movement.Type.ENTER === type
            ? "text-green-600 border-green-600"
            : "text-red-600 border-red-600"
        }
      >
        {Movement.Type.ENTER === type ? (
          <>
            <ArrowDownCircleIcon className="w-4 h-4 mr-1" />
            Entrada
          </>
        ) : (
          <>
            <ArrowUpCircleIcon className="w-4 h-4 mr-1" />
            Saída
          </>
        )}
      </Badge>
    ),
  },

  {
    header: "Base",
    accessorKey: "base",
    cell: ({
      row: {
        original: { base },
      },
    }) => base.sku,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({
      row: {
        original: { status },
      },
    }) => getStatusBadge(status),
  },
  {
    header: "Datas",
    accessorKey: "created_at",
    cell: ({
      row: {
        original: { created_at, confirmed_at },
      },
    }) => (
      <div className="flex flex-col gap-1">
        <div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          title="Data de cadastro"
        >
          <CalendarDays className="w-4 h-4" />
          {new Date(created_at).toLocaleString("pt-BR")}
        </div>
        <div
          className="flex items-center gap-2 text-sm"
          title="Data de confirmação"
        >
          {confirmed_at ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              {new Date(confirmed_at).toLocaleString("pt-BR")}
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">--</span>
            </>
          )}
        </div>
      </div>
    ),
  },

  {
    header: "Ações",
    accessorKey: "created_at",
    cell: ({
      row: {
        original: { status, id },
      },
    }) => {
      const hideEdit = props.restrictFeatureByProfile(
        "logistic:movement:update"
      );
      return (
        <td className="flex gap-2 items-center">
          {hideEdit && status === "PENDING" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => confirmManyMovement([id])}
            >
              <CheckIcon className="w-3 h-3" />
            </Button>
          )}
        </td>
      );
    },
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="flex items-center gap-2 w-fit">
          <ClockIcon className="size-4" />
          Pendente
        </Badge>
      );
    case "CONFIRM":
      return (
        <Badge variant="outline" className="flex items-center gap-2 w-fit">
          <CheckIcon className="size-4 text-green-500" />
          Confirmado
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "PRODUCT":
      return (
        <Badge variant="outline" className="flex gap-2 item-center">
          <Package className="size-4" />
          Produto
        </Badge>
      );
    case "INPUT":
      return (
        <Badge variant="outline" className="flex gap-2 item-center">
          <Wrench className="size-4" /> Insumo
        </Badge>
      );
    case "COMPONENT":
      return (
        <Badge variant="outline" className="flex gap-2 item-center">
          <Cpu className="size-4" /> Componente
        </Badge>
      );
    default:
      return null;
  }
};
