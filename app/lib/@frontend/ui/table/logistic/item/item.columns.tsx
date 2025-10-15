"use-client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/frontend/ui/component/button';

import {IItem} from "@/backend/domain/logistic/entity/item.entity";
import {Item} from "@/backend/domain/logistic/entity/item.entity";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Badge } from "../../../component/badge";
import { Cpu, Package, Wrench } from "lucide-react";

interface Props {
  openAuditModal?: (user: Pick<IItem, "ref" | "id">) => void;
  restrictFeatureByProfile: (sku: string) => boolean;
}

export const columns = (props: Props): ColumnDef<IItem>[] => [
  {
    header: "Tipo",
    accessorKey: "type",
    cell: ({ row }) => {
      const {
        original: { type },
      } = row;
      return (
        <Badge variant="secondary" className={`gap-1 ${getTypeColor(type)}`}>
          {getTypeIcon(type)}
          {type}
        </Badge>
      );
    },
  },
  {
    header: "SKU",
    accessorKey: "ref",
    cell: ({
      row: {
        original: {
          ref: { sku },
        },
      },
    }) => sku,
  },
  {
    header: "Nome",
    accessorKey: "ref",
    cell: ({
      row: {
        original: {
          ref: { name },
        },
      },
    }) => name,
  },
  {
    header: "Ações",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const { original } = row;

      const hideEdit = props.restrictFeatureByProfile("logistic:item:update");
      return (
        <td className="flex gap-2 items-center">
          {hideEdit && (
            <Link href={`/logistic/item/form/update?id=${original.id}`}>
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case "PRODUCT":
      return <Package className="h-4 w-4" />;
    case "INPUT":
      return <Wrench className="h-4 w-4" />;
    case "COMPONENT":
      return <Cpu className="h-4 w-4" />;
    default:
      return null;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "PRODUCT":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "INPUT":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "COMPONENT":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

