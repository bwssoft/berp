import { getSaleOrderAttachmentUrl } from "@/backend/action/omie/attachments/get-sale-order-attachment-url";
import { OmieEnterpriseEnum } from "@/backend/domain/@shared/gateway/omie.gateway.interface";

export function useAttachmentDetails() {
  async function downloadAttachment(params: {
    saleOrderId: string;
    domain: string;
    attachmentName: string;
    attachmentId: string;
    enterprise: keyof typeof OmieEnterpriseEnum;
  }) {
    const url = await getSaleOrderAttachmentUrl(params);

    const link = document.createElement("a");

    link.href = url;
    link.download = url.split("/").pop() || "downloaded_file";
    link.target = "_blank";
    link.click();
  }

  return {
    downloadAttachment,
  };
}
