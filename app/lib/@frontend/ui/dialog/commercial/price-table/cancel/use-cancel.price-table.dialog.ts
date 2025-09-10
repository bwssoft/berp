import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { cancelPriceTable } from "@/app/lib/@backend/action/commercial/price-table.action";

export function useCancelPriceTableDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openDialog = () => setOpen(true);

    const searchParams = useSearchParams();
    const priceTableId = searchParams.get("id");

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
    handleCancelPriceTable,
  };
}
