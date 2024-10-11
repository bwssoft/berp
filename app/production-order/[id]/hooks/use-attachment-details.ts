import { getSaleOrderAttachmentUrl } from "@/app/lib/@backend/action/omie/attachments/get-sale-order-attachment-url";
import { OmieEnterpriseEnum } from "@/app/lib/@backend/domain/@shared/gateway/omie/omie.gateway.interface";
import axios from "axios";

export function useAttachmentDetails() {
  async function downloadAttachment(params: {
    saleOrderId: string;
    domain: string;
    attachmentName: string;
    attachmentId: string;
    enterprise: keyof typeof OmieEnterpriseEnum;
  }) {
    const url = await getSaleOrderAttachmentUrl(params);

    console.log({ url });

    const response = await axios.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const link = document.createElement("a");

    link.href = window.URL.createObjectURL(blob);
    link.download = url.split("/").pop() || "downloaded_file";
    link.click();

    window.URL.revokeObjectURL(link.href);
  }

  return {
    downloadAttachment,
  };
}
