import { IComponent } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "../../../component";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface Props {
  restrictFeatureByProfile: (code: string) => boolean;
}

export const columns = (props: Props): ColumnDef<IComponent>[] => [
  {
    header: "Código",
    accessorKey: "code",
    cell: ({ row }) => {
      const component = row.original;
      return `${component.category.code.toUpperCase()}${component.seq
        .toString()
        .padStart(3, "0")}`;
    },
  },
  {
    header: "Nome",
    accessorKey: "name",
    cell: ({
      row: {
        original: { color, name },
      },
    }) => (
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: color }}
        />
        {name}
      </div>
    ),
  },
  {
    header: "Unidade de medida",
    accessorKey: "measure_unit",
  },
  {
    header: "Data de criação",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const component = row.original;
      return component.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const component = row.original;

      const showEdit = props.restrictFeatureByProfile(
        "engineer:component:update"
      );
      return (
        <>
          {showEdit && (
            <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <Link
                href={`/engineer/component/component/form/update?id=${component.id}`}
                className="text-blue-600 hover:text-blue-900"
              >
                <Button
                  title="Editar"
                  variant="ghost"
                  className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <PencilSquareIcon className="size-5" />
                </Button>
              </Link>
            </td>
          )}
        </>
      );
    },
  },
];
