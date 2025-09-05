import { useState } from "react";
import { toast } from "@/app/lib/@frontend/hook/use-toast";

export function useInactivatePriceTableDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => setOpen(true);

  const inactivatePriceTable = async () => {
    setIsLoading(true);
    try {
      // Add your inactivate logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

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
    inactivatePriceTable,
  };
}
