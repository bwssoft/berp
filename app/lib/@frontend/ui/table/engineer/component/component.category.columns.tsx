import { IComponentCategory } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "../../../component";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface Props {
  restrictFeatureByProfile: (code: string) => boolean;
}

export const columns = (props: Props): ColumnDef<IComponentCategory>[] => [
  {
    header: "Código",
    accessorKey: "code",
  },
  {
    header: "Nome",
    accessorKey: "name",
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
        "engineer:component:category:update"
      );
      return (
        <>
          {showEdit && (
            <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <Link
                href={`/engineer/component/category/form/update?id=${component.id}`}
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
