"use-client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../component";
import { IMovement } from "@/app/lib/@backend/domain";
import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Badge } from "../../../component/badge";

interface Props {
  restrictFeatureByProfile: (code: string) => boolean;
}

export const columns = (props: Props): ColumnDef<IMovement>[] => [
  {
    header: "ID",
    accessorKey: "seq",
    cell: ({
      row: {
        original: { seq },
      },
    }) => "MOV" + seq,
  },
  {
    header: "Item",
    accessorKey: "item",
    cell: ({
      row: {
        original: { item },
      },
    }) => item.ref.sku,
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
    header: "Confirmado em",
    accessorKey: "confirmed_at",
    cell: ({
      row: {
        original: { confirmed_at },
      },
    }) => {
      confirmed_at ? new Date(confirmed_at).toLocaleDateString("pt-BR") : "-";
    },
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
              onClick={() => alert(id + "CONFIRM")}
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
        <Badge className="text-yellow-600 border-yellow-600">
          <ClockIcon className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      );
    case "CONFIRM":
      return (
        <Badge className="text-green-600 border-green-600">
          <CheckIcon className="w-3 h-3 mr-1" />
          Confirmado
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
