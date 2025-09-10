import { useState } from "react";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useSearchParams } from "next/navigation";
import { inactivatePriceTable } from "@/app/lib/@backend/action/commercial/price-table.action";

export function useInactivatePriceTableDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => setOpen(true);
  const searchParams = useSearchParams();
  const priceTableId = searchParams.get("id");

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
