import { useState } from "react";
import { toast } from "@/app/lib/@frontend/hook/use-toast";

export function usePublishPriceTableDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => setOpen(true);

  const publishPriceTable = async () => {
    setIsLoading(true);
    try {
      // Add your publish logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        variant: "success",
        description: "Tabela publicada com sucesso!",
        title: "Sucesso",
      });

      setOpen(false);
    } catch (error) {
      toast({
        variant: "error",
        description: "Erro ao publicar tabela. Tente novamente.",
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
    publishPriceTable,
  };
}
