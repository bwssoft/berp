"use-client";

import { Badge } from "@bwsoft/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../component";
import { IBase, Base } from "@/app/lib/@backend/domain";
import { ClockIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { baseConstants } from "@/app/lib/constant/logistic";

interface Props {
  openAuditModal?: (user: Pick<IBase, "code" | "id">) => void;
  restrictFeatureByProfile: (code: string) => boolean;
}

export const columns = (props: Props): ColumnDef<IBase>[] => [
  { header: "Código", accessorKey: "code" },
  {
    header: "Tipo",
    accessorKey: "type",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <Badge
          label={baseConstants.type[original.type]}
          className={getTypeColor(original.type)}
        />
      );
    },
  },
  {
    header: "Empresa",
    accessorKey: "enterprise",
    cell: ({ row }) => {
      const user = row.original;
      return user.enterprise.name.short;
    },
  },
  {
    header: "Status",
    accessorKey: "document",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <Badge
          variant="basic"
          theme={original.active ? "green" : "gray"}
          label={original.active ? "Ativo" : "Inativo"}
        />
      );
    },
  },
  {
    header: "Ações",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const { original } = row;

      const hideEdit = props.restrictFeatureByProfile("logistic:base:update");
      return (
        <td className="flex gap-2 items-center">
          {hideEdit && (
            <Link href={`/logistic/base/form/update?id=${original.id}`}>
              <Button
                title="Editar"
                variant="ghost"
                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilSquareIcon className="size-5" />
              </Button>
            </Link>
          )}
        </td>
      );
    },
  },
];

const getTypeColor = (type: Base.Type) => {
  const colors = {
    STOCK: "bg-blue-100 text-blue-800",
    WAREHOUSE: "bg-green-100 text-green-800",
    SHIPMENT: "bg-orange-100 text-orange-800",
    PRODUCTION: "bg-purple-100 text-purple-800",
  };
  return colors[type];
};
