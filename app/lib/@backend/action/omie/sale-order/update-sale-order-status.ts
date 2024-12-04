"use server";

import { OmieEnterpriseEnum } from "../../../domain/@shared/gateway/omie/omie.gateway.interface";
import { OmieSaleOrderStage } from "../../../domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import { saleOrderOmieGateway } from "../../../gateway/omie";

type GetSaleOrderAttachmentUrlParams = {
  saleOrderId: string;
  statusId: OmieSaleOrderStage;
  enterprise: keyof typeof OmieEnterpriseEnum;
};

export async function updateSaleOrderStatus(
  params: GetSaleOrderAttachmentUrlParams
) {
  saleOrderOmieGateway.setSecrets(OmieEnterpriseEnum[params.enterprise]);

  await saleOrderOmieGateway.updateStage(params.saleOrderId, params.statusId);
}
