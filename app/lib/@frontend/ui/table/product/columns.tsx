import { deleteOneProductById } from "@/app/lib/@backend/action";
import { IProduct } from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<IProduct>[] = [
  { header: "Nome", accessorKey: "name" },
  {
    header: "Quant. Insumos",
    accessorKey: "inputs",
    cell: ({ row }) => {
      const product = row.original;
      return product.inputs.length;
    },
  },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const product = row.original;
      return product.created_at.toLocaleString();
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link
            href={`/product/form/update?id=${product.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Editar
          </Link>
          <form action={() => deleteOneProductById({ id: product.id! })}>
            <button
              type="submit"
              className="text-indigo-600 hover:text-indigo-900 px-0 py-0"
            >
              Deletar
            </button>
          </form>
        </td>
      );
    },
  },
];
