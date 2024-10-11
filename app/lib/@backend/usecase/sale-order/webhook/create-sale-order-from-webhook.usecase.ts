import { ISaleOrder } from "@/app/lib/@backend/domain";
import { appHashsMapping } from "@/app/lib/constant/app-hashs";
import { saleOrderConstants } from "@/app/lib/constant/sale-order";
import { singleton } from "@/app/lib/util/singleton";
import { OmieEnterpriseEnum } from "../../../domain/@shared/gateway/omie/omie.gateway.interface";
import { OmieSaleOrderEvents } from "../../../domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import {
  attachmentOmieGateway,
  saleOrderOmieGateway,
} from "../../../gateway/omie";
import { findOneClientUsecase } from "../../client";
import { findManyProductUsecase } from "../../product";
import { createOneSaleOrderUsecase } from "../sale-order";

export interface CreateSaleOrderFromWebhookUseCaseInput {
  body: OmieSaleOrderEvents["VendaProduto.Incluida"];
}

class CreateSaleOrderFromWebhookUseCase {
  async execute(input: CreateSaleOrderFromWebhookUseCaseInput) {
    const body = input.body;

    console.log("CreateSaleOrderFromWebhookUseCase");
    console.log({ body });

    const { idCliente, idPedido, valorPedido, etapa, numeroPedido } =
      body.event;

    const enterpriseHashMapped = appHashsMapping[body.appHash];

    saleOrderOmieGateway.setSecrets(OmieEnterpriseEnum[enterpriseHashMapped]);
    attachmentOmieGateway.setSecrets(OmieEnterpriseEnum[enterpriseHashMapped]);

    const stringifiedSaleOrderId = idPedido.toString();

    const saleOrderData = await saleOrderOmieGateway.find(
      stringifiedSaleOrderId
    );

    const det = saleOrderData.pedido_venda_produto?.det ?? [];

    const productsMapped = det.map(({ produto }) => ({
      id: produto.codigo_produto.toString(),
      quantity: produto.quantidade,
    }));

    const productsIds = productsMapped.map(({ id }) => id);

    const databaseProducts = await findManyProductUsecase.execute({
      [`omie_code_metadata.${enterpriseHashMapped}`]: {
        $in: productsIds,
      },
    });

    const databaseClient = await findOneClientUsecase.execute({
      [`omie_code_metadata.${enterpriseHashMapped}`]: idCliente.toString(),
    });

    if (databaseClient === null) {
      return;
    }

    const attachmentsData = await attachmentOmieGateway.findAll(
      stringifiedSaleOrderId
    );

    const attachments = attachmentsData.listaAnexos;

    const mongoSaleOrder: Omit<ISaleOrder, "id" | "created_at"> = {
      client_id: databaseClient.id,
      products: databaseProducts.map(({ id, omie_code_metadata }) => ({
        product_id: id,
        quantity: productsMapped.find(
          (item) => item.id === omie_code_metadata?.[enterpriseHashMapped]
        )!.quantity,
      })),
      omie_webhook_metadata: {
        enterprise: enterpriseHashMapped,
        client_id: idCliente.toString(),
        order_id: idPedido.toString(),
        order_number: numeroPedido.toString(),
        value: valorPedido,
        files: attachments.map(({ cNomeArquivo, cTabela, nId, nIdAnexo }) => ({
          file_name: cNomeArquivo,
          domain: cTabela,
          order_id: nId,
          attachment_id: nIdAnexo.toString(),
        })),
        stage: saleOrderConstants.stageOmieMapped[etapa],
      },
    };

    const newSaleOrder = await createOneSaleOrderUsecase.execute(
      mongoSaleOrder
    );

    console.log("CreateSaleOrderFromWebhookUseCase - end of usecase");

    if (newSaleOrder.insertedId) {
      return newSaleOrder;
    }
  }
}

export const createSaleOrderFromWebhookUseCase = singleton(
  CreateSaleOrderFromWebhookUseCase
);
