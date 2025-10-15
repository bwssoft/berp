import { useState } from "react";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { inactivatePriceTable } from "@/backend/action/commercial/price-table.action";

interface UseInactivatePriceTableDialogProps {
  priceTableId?: string;
  onSuccess?: () => void;
}

export function useInactivatePriceTableDialog({
  priceTableId,
  onSuccess,
}: UseInactivatePriceTableDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => setOpen(true);

  const handleInactivatePriceTable = async () => {
    setIsLoading(true);
    try {
      if (!priceTableId) {
        toast({
          variant: "error",
          description: "ID da tabela não encontrado.",
          title: "Erro",
        });
        setIsLoading(false);
        return;
      }
      await inactivatePriceTable(priceTableId);

      toast({
        variant: "success",
        description: "Tabela inativada com sucesso!",
        title: "Sucesso",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "error",
        description: "Erro ao inativar tabela. Tente novamente.",
        title: "Erro",
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
    handleInactivatePriceTable,
  };
}

