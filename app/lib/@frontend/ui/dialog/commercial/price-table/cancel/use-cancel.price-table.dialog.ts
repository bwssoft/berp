import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib/@frontend/hook/use-toast";

export function useCancelPriceTableDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openDialog = () => setOpen(true);

  const cancelPriceTable = async () => {
    setIsLoading(true);
    try {
      // Add your cancel logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        variant: "success",
        description: "Tabela cancelada com sucesso!",
        title: "Sucesso",
      });

      router.push("/commercial/price-table");
      setOpen(false);
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
    cancelPriceTable,
  };
}
