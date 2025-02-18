import { deleteOneConfigurationProfileById } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<{
  id: string;
  name: string;
  technology: { id: string; name: { brand: string } };
  client: {
    id: string;
    document: { value: string };
    company_name: string;
    trade_name: string;
  };
  validation: {
    by_human: boolean;
    by_system: boolean;
  };
}>[] = [
  { header: "Identificador", accessorKey: "name" },
  {
    header: "Cliente",
    accessorKey: "client",
    cell: ({ row }) => {
      const profile = row.original;
      return profile.client?.company_name ?? profile.client?.trade_name;
    },
  },
  {
    header: "Tecnologia",
    accessorKey: "technology",
    cell: ({ row }) => {
      const profile = row.original;
      return profile.technology.name.brand;
    },
  },
  {
    header: "Ações",
    accessorKey: "name",
    cell: ({ row }) => {
      const profile = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/crm/configuration-profile/form/update?id=${profile.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <p className="text-indigo-600 hover:text-indigo-900 px-0 py-0">
            Selecionar
          </p>
        </td>
      );
    },
  },
];
