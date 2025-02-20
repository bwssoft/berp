"use server";

import { OmieEnterpriseEnum } from "@/app/lib/@backend/domain/@shared/gateway/omie.gateway.interface";
import { attachmentOmieGateway } from "@/app/lib/@backend/infra";

type GetSaleOrderAttachmentUrlParams = {
  saleOrderId: string;
  domain: string;
  attachmentName: string;
  attachmentId: string;
  enterprise: keyof typeof OmieEnterpriseEnum;
};

export async function getSaleOrderAttachmentUrl(
  params: GetSaleOrderAttachmentUrlParams
) {
  attachmentOmieGateway.setSecrets(OmieEnterpriseEnum[params.enterprise]);

  const url = await attachmentOmieGateway.getAttachmentUrl(params);

  return url;
}
