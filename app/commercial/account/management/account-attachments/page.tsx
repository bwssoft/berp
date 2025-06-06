import { Button, Input } from "@/app/lib/@frontend/ui/component";
import { AccountAttachmentsTable } from "@/app/lib/@frontend/ui/table";
import { FolderOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export default function Page() {
  return (
    <div className="grid grid-cols-2 flex-col gap-4">
      <div className="flex items-end justify-between col-span-2 w-full">
        <div className="flex gap-2 items-end w-2/4">
          <Input
            label="Nome do Arquivo"
            placeholder="Digite o nome do arquivo"
          />
          <Button type="submit" className="rounded-full">
            <MagnifyingGlassIcon className="text-white w-4 h-4" /> Pesquisar
          </Button>
        </div>
        <Button>
          <FolderOpenIcon className="text-white w-4 h-4" /> Anexar
        </Button>
      </div>

      <div className="col-span-2">
        <AccountAttachmentsTable
          data={[
            {
              id: String(1),
              name: " Comprovante de pagamento",
              userId: "Chelsea Hagon",
              file: undefined,
              createdAt: new Date("2023-01-01:00:00:00"),
            },
            {
              id: String(2),
              name: "Cartão CNPJ",
              userId: "Chelsea Hagon",
              file: undefined,
              createdAt: new Date("2023-01-01:00:00:00"),
            },
            {
              id: String(3),
              name: "Comprovante de residência",
              userId: "Chelsea Hagon",
              file: undefined,
              createdAt: new Date("2023-01-01:00:00:00"),
            },
            {
              id: String(4),
              name: "Foto",
              userId: "Toom Cook",
              file: undefined,
              createdAt: new Date("2023-01-01:00:00:00"),
            },
            {
              id: String(4),
              name: "Contrato",
              userId: "Sistema",
              file: undefined,
              createdAt: new Date("2023-01-01:00:00:00"),
            },
            {
              id: String(5),
              name: "Proposta",
              userId: "Sistema",
              file: undefined,
              createdAt: new Date("2023-01-01:00:00:00"),
            },
          ]}
        />
      </div>
    </div>
  );
}
