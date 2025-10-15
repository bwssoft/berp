"use server";

import { OmieEnterpriseEnum } from "@/backend/domain/@shared/gateway/omie.gateway.interface";
import { OmieSaleOrderStage } from "@/backend/domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import { saleOrderOmieGateway } from "@/backend/infra";

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

