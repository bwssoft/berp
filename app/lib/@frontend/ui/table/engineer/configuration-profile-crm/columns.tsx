import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { generateConfigurationProfileLinkForClient } from "../../../form/engineer/configuration-profile/util";
import { SelectColumn } from "./select-column";
import { deleteOneConfigurationProfileById } from "@/app/lib/@backend/action/engineer/configuration-profile.action";

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
  selected: boolean;
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
        <td className="flex divide-x divide-gray-200 text-right text-sm font-medium sm:pr-0">
          <SelectColumn
            configurationProfileId={profile.id}
            selected={profile.selected}
          />
          <div className="px-2">
            <Link
              href={`/crm/configuration-profile/form/update?id=${profile.id}`}
              className="text-blue-600 hover:text-blue-900"
            >
              Editar
            </Link>
          </div>
          <div className="px-2">
            <button
              type="button"
              onClick={() =>
                generateConfigurationProfileLinkForClient(profile.id)
              }
              className="text-blue-600 hover:text-blue-900"
            >
              Link
            </button>
          </div>
          <div className="px-2">
            <form
              action={() =>
                deleteOneConfigurationProfileById({ id: profile.id })
              }
            >
              <button
                type="submit"
                className="text-blue-600 hover:text-blue-900"
              >
                Arquivar
              </button>
            </form>
          </div>
        </td>
      );
    },
  },
];
