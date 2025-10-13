import { useState } from "react";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import {
  publishPriceTable,
  updateOnePriceTable,
  findOnePriceTable,
} from "@/backend/action/commercial/price-table.action";

interface UsePublishPriceTableDialogProps {
  priceTableId?: string;
  onSuccess?: () => void;
}

const ensureFutureStartDate = (startDateTime: Date) => {
  const now = new Date();
  const oneMinuteFromNow = new Date(now.getTime() + 60000); // Add 1 minute

  // If the start date is in the past or very close to now, use one minute from now
  if (startDateTime <= now) {
    return oneMinuteFromNow;
  }

  return startDateTime;
};

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
      const priceTableData = await findOnePriceTable({ id: priceTableId });

      if (priceTableData) {
        const originalStartDate = new Date(priceTableData.startDateTime);
        const adjustedStartDate = ensureFutureStartDate(originalStartDate);

        if (adjustedStartDate.getTime() !== originalStartDate.getTime()) {
          const updateResult = await updateOnePriceTable({
            ...priceTableData,
            startDateTime: adjustedStartDate,
          });

          if (!updateResult?.success) {
            toast({
              variant: "error",
              title: "Erro",
              description: "Erro ao ajustar data de início. Tente novamente.",
            });
            return;
          }
        }
      }

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
      setOpen(false);
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

