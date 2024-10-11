"use server";

import { OmieEnterpriseEnum } from "../../../domain/@shared/gateway/omie/omie.gateway.interface";
import { attachmentOmieGateway } from "../../../gateway/omie";

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
