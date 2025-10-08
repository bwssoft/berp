"use-client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/frontend/ui/component/button';

import { IBase, Base } from "@/app/lib/@backend/domain";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { baseConstants } from "@/app/lib/constant/logistic";
import { Badge } from "../../../component/badge";

interface Props {
  openAuditModal?: (user: Pick<IBase, "sku" | "id">) => void;
  restrictFeatureByProfile: (sku: string) => boolean;
}

export const columns = (props: Props): ColumnDef<IBase>[] => [
  { header: "SKU", accessorKey: "sku" },
  {
    header: "Tipo",
    accessorKey: "type",
    cell: ({ row }) => {
      const { original } = row;
      return (
        <Badge variant="outline" className={getTypeColor(original.type)}>
          {baseConstants.type[original.type]}
        </Badge>
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
        <Badge variant="outline">{original.active ? "Ativo" : "Inativo"}</Badge>
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
