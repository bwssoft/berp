import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Dialog } from "@/app/lib/@frontend/ui/component/dialog";
import * as React from "react";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  confirm: () => void;
  isLoading: boolean;
}

export function InactivatePriceTableDialog({
  open,
  setOpen,
  confirm,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Inativar tabela</h2>

        <p className="mt-2 text-sm text-gray-600">
          Ao confirmar esta ação, a tabela será inativada. No caso de tabela do
          tipo normal será necessário aguardar o cadastro e publicação/ativação
          de nova tabela para que os preços voltem a aparecer nas propostas caso
          não tenha uma tabela provisória em vigor. No caso de tabela do tipo
          provisória, automaticamente a tabela do tipo normal que estiver ‘Em
          Pausa’ será reativada se houver. Caso não tenha tabela ‘Em Pausa’
          então será necessário aguardar o cadastro e publicação/ativação de
          nova tabela para que os preços voltem a aparecer na proposta.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirm}
            disabled={isLoading}
          >
            Inativar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
