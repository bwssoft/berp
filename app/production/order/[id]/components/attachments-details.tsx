"use client";

import {IFinancialOrder} from "@/backend/domain/financial/entity/financial-order.definition";
import { Button } from '@/frontend/ui/component/button';
import { DataTable } from '@/frontend/ui/component/data-table';

import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useAttachmentDetails } from "../hooks";

type AttachmentsDetailsProps = {
  saleOrder: IFinancialOrder | null;
};

export function AttachmentsDetails({ saleOrder }: AttachmentsDetailsProps) {
  const { downloadAttachment } = useAttachmentDetails();

  if (!saleOrder) return <p>Dados da ordem de serviço não encontrados.</p>;

  return (
    <div className="p-2">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Anexos
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Aba contendo a lista de anexos dessa ordem de serviço
        </p>
      </div>

      <div className="mt-6 border-t border-gray-100">
        <div className="flex mt-1 text-sm leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
          <DataTable
            data={saleOrder.omie_webhook_metadata.files ?? []}
            columns={[
              {
                header: "Nome do anexo",
                accessorKey: "file_name",
              },
              {
                header: "Ações",
                accessorKey: "attachment_id",
                cell: ({ row }) => (
                  <Button
                    className="flex flex-row gap-2"
                    variant="outline"
                    onClick={() => {
                      downloadAttachment({
                        attachmentId: row.original.attachment_id,
                        attachmentName: row.original.file_name,
                        domain: row.original.domain,
                        saleOrderId: saleOrder.omie_webhook_metadata.order_id,
                        enterprise: saleOrder.omie_webhook_metadata.enterprise!,
                      });
                    }}
                  >
                    Download
                    <ArrowDownTrayIcon width="14" height="14" />
                  </Button>
                ),
              },
            ]}
            mobileDisplayValue={(data) => data.attachment_id}
            mobileKeyExtractor={(data) => data.attachment_id}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
