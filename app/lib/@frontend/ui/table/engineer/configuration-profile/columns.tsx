import { deleteOneConfigurationProfileById } from "@/app/lib/@backend/action/engineer/configuration-profile.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
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
    header: "Validação",
    accessorKey: "validation",
    cell: ({ row }) => {
      const profile = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          {profile.validation.by_human ? (
            <CheckCircleIcon
              title="Validado por um humano"
              className="text-green-400"
              height={24}
              width={24}
            />
          ) : (
            <ExclamationTriangleIcon
              title="Validação humana pendente"
              className="text-orange-400"
              height={24}
              width={24}
            />
          )}
          {profile.validation.by_system ? (
            <CheckCircleIcon
              title="Validado pelo sistema"
              className="text-green-400"
              height={24}
              width={24}
            />
          ) : (
            <ExclamationTriangleIcon
              title="Validação sistêmica pendente"
              className="text-orange-400"
              height={24}
              width={24}
            />
          )}
        </td>
      );
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
            href={`/engineer/configuration-profile/form/update?id=${profile.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </Link>
          <form
            action={async () => {
              try {
                await deleteOneConfigurationProfileById({ id: profile.id });
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
              className="text-blue-600 hover:text-blue-900 px-0 py-0"
            >
              Arquivar
            </button>
          </form>
        </td>
      );
    },
  },
];
