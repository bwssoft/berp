import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { cancelPriceTable } from "@/app/lib/@backend/action/commercial/price-table.action";

interface UseCancelPriceTableDialogProps {
  priceTableId?: string;
}

export function useCancelPriceTableDialog({
  priceTableId,
}: UseCancelPriceTableDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openDialog = () => setOpen(true);

  const handleCancelPriceTable = async () => {
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

      await cancelPriceTable(priceTableId);

      toast({
        variant: "success",
        description: "Tabela cancelada com sucesso!",
        title: "Sucesso",
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        variant: "error",
        description: "Erro ao cancelar tabela. Tente novamente.",
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
    handleCancelPriceTable,
  };
}
