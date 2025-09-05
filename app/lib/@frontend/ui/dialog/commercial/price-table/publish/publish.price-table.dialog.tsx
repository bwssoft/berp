import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Dialog } from "@/app/lib/@frontend/ui/component/dialog";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import * as React from "react";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  confirm: () => void;
  isLoading: boolean;
}

export function PublishPriceTableDialog({
  open,
  setOpen,
  confirm,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
          Publicar tabela
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Ao confirmar a ação, a tabela será publicada na data e hora informadas
          para início na área de configurações gerais. A tabela não provisória
          que estiver em vigor será automaticamente inativada. Se houver uma
          tabela provisória em vigor, então esta tabela será ativada na data e
          hora informadas nas configurações gerais, mas não será utilizada
          enquanto a tabela provisória estiver ativa.
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
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={confirm}
            disabled={isLoading}
          >
            Publicar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
