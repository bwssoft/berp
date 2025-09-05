"use client";

import { Button } from "@/app/lib/@frontend/ui/component";
import { CreatePriceTableForm } from "@/app/lib/@frontend/ui/form/commercial/price-table/create/price-table.create.form";
import Link from "next/link";
import { CancelPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/cancel/cancel.price-table.dialog";
import { PublishPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/publish/publish.price-table.dialog";
import { useCancelPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/cancel/use-cancel.price-table.dialog";
import { usePublishPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/publish/use-publish.price-table.dialog";

export default function CreatePriceTablePage() {
  // Dialog hooks
  const {
    open: openCancelDialog,
    setOpen: setOpenCancelDialog,
    openDialog: openCancelPriceTableDialog,
    isLoading: isLoadingCancel,
    cancelPriceTable,
  } = useCancelPriceTableDialog();

  const {
    open: openPublishDialog,
    setOpen: setOpenPublishDialog,
    openDialog: openPublishPriceTableDialog,
    isLoading: isLoadingPublish,
    publishPriceTable,
  } = usePublishPriceTableDialog();

  return (
    <div className="space-y-4 pt-8">
      {/* Header with title and buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tabela de Preços
        </h1>
        <div className="flex gap-2">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={openPublishPriceTableDialog}
          >
            Publicar
          </Button>
          <Link href="/commercial/price-table">
            <Button variant="outline">Voltar</Button>
          </Link>
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={openCancelPriceTableDialog}
          >
            Cancelar tabela
          </Button>
          <Button>Salvar</Button>
        </div>
      </div>

      {/* Form content */}
      <div className="bg-white">
        <CreatePriceTableForm />
      </div>

      {/* Dialogs */}
      <CancelPriceTableDialog
        open={openCancelDialog}
        setOpen={setOpenCancelDialog}
        confirm={cancelPriceTable}
        isLoading={isLoadingCancel}
      />

      <PublishPriceTableDialog
        open={openPublishDialog}
        setOpen={setOpenPublishDialog}
        confirm={publishPriceTable}
        isLoading={isLoadingPublish}
      />
    </div>
  );
}
