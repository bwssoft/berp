import { useState } from "react";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { publishPriceTable } from "@/app/lib/@backend/action/commercial/price-table.action";

interface UsePublishPriceTableDialogProps {
  priceTableId?: string;
  onSuccess?: () => void;
}

export function usePublishPriceTableDialog({
  priceTableId,
  onSuccess,
}: UsePublishPriceTableDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => setOpen(true);

  const publishPriceTableAction = async () => {
    if (!priceTableId) {
      toast({
        variant: "error",
        title: "Erro",
        description: "ID da tabela não encontrado.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await publishPriceTable(priceTableId);

      if (result?.success) {
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Tabela publicada com sucesso!",
        });

        setOpen(false);
        onSuccess?.();
      } else {
        toast({
          variant: "error",
          title: "Erro",
          description:
            result?.error?.global ||
            "Erro ao publicar tabela. Tente novamente.",
        });
      }
    } catch (error) {
      toast({
        variant: "error",
        title: "Erro",
        description: "Erro ao publicar tabela. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    open,
    setOpen,
    openDialog,
    isLoading,
    publishPriceTable: publishPriceTableAction,
  };
}
