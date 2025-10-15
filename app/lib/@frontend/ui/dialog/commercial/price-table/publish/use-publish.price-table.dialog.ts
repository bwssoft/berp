import { useState } from "react";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import {
  publishPriceTable,
  updateOnePriceTable,
  findOnePriceTable,
} from "@/app/lib/@backend/action/commercial/price-table.action";

interface UsePublishPriceTableDialogProps {
  priceTableId?: string;
  onSuccess?: () => void;
  onValidationError?: (errors: {
    startDateTime?: string;
    endDateTime?: string;
  }) => void;
}

const ensureFutureStartDate = (startDateTime: Date) => {
  const now = new Date();
  const oneMinuteFromNow = new Date(now.getTime() + 60000);

  if (startDateTime <= now) {
    return oneMinuteFromNow;
  }

  return startDateTime;
};

export function usePublishPriceTableDialog({
  priceTableId,
  onSuccess,
  onValidationError,
}: UsePublishPriceTableDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    startDateTime?: string;
    endDateTime?: string;
  }>({});

  const openDialog = () => {
    setOpen(true);
    // Limpa erros ao abrir o dialog
    setFieldErrors({});
  };

  const closeDialog = () => {
    setOpen(false);
    setFieldErrors({});
  };

  const publishPriceTableAction = async () => {
    if (!priceTableId) {
      toast({
        variant: "error",
        title: "Erro",
        description: "ID da tabela não encontrado.",
      });
      return;
    }

    // Limpa erros anteriores
    setFieldErrors({});

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

        closeDialog();
        onSuccess?.();
      } else {
        // Exibe toast com erro global
        toast({
          variant: "error",
          title: "Erro ao publicar",
          description:
            result?.error?.global ||
            "Erro ao publicar tabela. Tente novamente.",
        });

        // Armazena erros de campo no estado
        if (result?.error?.fields) {
          setFieldErrors(result.error.fields);
          // Notifica o componente pai sobre os erros
          onValidationError?.(result.error.fields);
        }
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

  const clearFieldError = (field: "startDateTime" | "endDateTime") => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  return {
    open,
    setOpen: closeDialog,
    openDialog,
    isLoading,
    fieldErrors,
    clearFieldError,
    publishPriceTable: publishPriceTableAction,
  };
}