import { deleteOneConfigurationProfileById } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<{
  id: string;
  name: string;
  model: string;
}>[] = [
    { header: "Nome", accessorKey: "name" },
    {
      header: "Modelo",
      accessorKey: "model",
    },
    {
      header: "Ações",
      accessorKey: "name",
      cell: ({ row }) => {
        const profile = row.original;
        const model = profile.model;
        return (
          <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
            <Link
              href={`/engineer/configuration-profile/form/update/${model.toLowerCase().replaceAll("dm_", "").replaceAll("_", "-")}?id=${profile.id
                }`}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Editar
            </Link>
            <form
              action={() => {
                try {
                  deleteOneConfigurationProfileById({ id: profile.id });
                  toast({
                    title: "Sucesso!",
                    description: "Perfil de configuração deletado com sucesso!",
                    variant: "success",
                  });
                } catch (e) {
                  toast({
                    title: "Falha!",
                    description: "Falha ao deletar o perfil de configuração!",
                    variant: "error",
                  });
                }
              }}
            >
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
