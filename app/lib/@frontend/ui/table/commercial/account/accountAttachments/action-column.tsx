import {IAccountAttachment} from "@/backend/domain/commercial/entity/account-attachment.definition";
import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { downloadAccountAttachment } from "@/backend/action/commercial/account-attachment.download.action";
import { deleteAccountAttachment } from "@/backend/action/commercial/account-attachment.delete.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { Button } from '@/frontend/ui/component/button';
import { Dialog } from '@/frontend/ui/component/dialog';

import { useState } from "react";

export function ActionColumn(props: {
  attachment: IAccountAttachment;
  onDelete?: (id: string) => Promise<void>;
  canDeleteAttachments: boolean;
}) {
  const { attachment, onDelete, canDeleteAttachments } = props;
  const [open, setOpen] = useState(false);

  const handleDownload = async () => {
    try {
      if (!attachment.id) {
        toast({
          title: "Erro",
          description: "ID do anexo não encontrado",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Download iniciado",
        description: `Baixando ${attachment.name}...`,
        variant: "default",
      });

      const result = await downloadAccountAttachment(attachment.id);
      if (result.success && result.data) {
        // Convert the array back to Uint8Array for Blob creation
        const uint8Array = new Uint8Array(result.data);
        const blob = new Blob([uint8Array], { type: result.contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up the URL object

        toast({
          title: "Sucesso",
          description: `${attachment.name} baixado com sucesso`,
          variant: "success",
        });
      } else {
        throw new Error("Failed to download file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Erro",
        description: "Falha ao fazer download do arquivo",
        variant: "error",
      });
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!attachment.id) {
        toast({
          title: "Erro",
          description: "ID do anexo não encontrado",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Excluindo",
        description: `Excluindo ${attachment.name}...`,
        variant: "default",
      });

      const result = await deleteAccountAttachment(attachment.id);

      if (result.success) {
        toast({
          title: "Sucesso",
          description: `${attachment.name} excluído com sucesso`,
          variant: "success",
        });
        // Call the onDelete callback with the ID to update the UI
        if (onDelete) {
          await onDelete(attachment.id);
        }
      } else {
        throw new Error(result.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir arquivo",
        variant: "error",
      });
    }
  };

  return (
    <td className="flex gap-2 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
      <button
        onClick={handleDownload}
        className="text-blue-600 hover:text-blue-900"
        title="Fazer download"
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
      </button>
      {canDeleteAttachments && (
        <form>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-blue-600 hover:text-blue-900 px-0 py-0"
            title="Excluir anexo"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </form>
      )}
      <Dialog open={open} setOpen={setOpen}>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Deletar Anexo</h2>

          <p className="mt-2 text-sm text-gray-600">
            Você tem certeza que deseja deletar esse anexo? Essa ação é
            irreversível.
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="default" onClick={handleDelete}>
              Confirmar
            </Button>
          </div>
        </div>
      </Dialog>
    </td>
  );
}

