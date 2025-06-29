import {
  ICommand,
  IDevice,
  IFirmware,
  ISchedule,
} from "@/app/lib/@backend/domain";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/app/lib/@frontend/hook";
import { deleteOneScheduleById } from "@/app/lib/@backend/action/engineer/command/schedule.action";

export const columns: ColumnDef<
  ISchedule & { device: IDevice; command: ICommand; firmware?: IFirmware }
>[] = [
  {
    header: "Equipamento",
    accessorKey: "device",
    cell: ({ row }) => {
      const schedule = row.original;
      return schedule.device.equipment.serial;
    },
  },
  {
    header: "Comando",
    accessorKey: "command",
    cell: ({ row }) => {
      const schedule = row.original;
      return schedule.command.name;
    },
  },
  {
    header: "Enviado",
    accessorKey: "pending",
    cell: ({ row }) => {
      const schedule = row.original;
      return schedule.pending ? "Pendente" : "Enviado";
    },
  },
  {
    header: "Tempo de criação",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const schedule = row.original;
      return schedule.created_at.toLocaleString();
    },
  },
  {
    header: "Tempo de execução",
    accessorKey: "request_timestamp",
    cell: ({ row }) => {
      const schedule = row.original;
      return schedule.request_timestamp
        ? new Date(schedule.request_timestamp).toLocaleString()
        : "--";
    },
  },
  {
    header: "",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const schedule = row.original;
      return (
        <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          {/* <Link
            href={`/command/form/schedule/update?id=${schedule.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </Link> */}
          <form
            action={async () => {
              try {
                await deleteOneScheduleById({ id: schedule.id! });
                toast({
                  title: "Sucesso!",
                  description: "Agendamento deletado com sucesso!",
                  variant: "success",
                });
              } catch (e) {
                toast({
                  title: "Erro!",
                  description: "Falha ao deletar o agendamento!",
                  variant: "error",
                });
              }
            }}
          >
            <button
              type="submit"
              className="text-blue-600 hover:text-blue-900 px-0 py-0"
            >
              Deletar
            </button>
          </form>
        </td>
      );
    },
  },
];
