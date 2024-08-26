import { appHashsMapping } from "@/app/lib/constant/app-hashs";
import { saleOrderConstants } from "@/app/lib/constant/sale-order";
import { singleton } from "@/app/lib/util/singleton";
import { ISaleOrder } from "../../../domain";
import { OmieEnterpriseEnum } from "../../../domain/@shared/gateway/omie/omie.gateway.interface";
import { OmieSaleOrderEvents } from "../../../domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import {
  attachmentOmieGateway,
  saleOrderOmieGateway,
} from "../../../gateway/omie";
import { findOneClientUsecase } from "../../client";
import { findManyProductUsecase } from "../../product";
import {
  createOneProductionOrderUsecase,
  findOneProductionOrderUsecase,
  updateOneProductionOrderUsecase,
} from "../../production-order";
import {
  findOneSaleOrderUsecase,
  updateOneSaleOrderUsecase,
} from "../sale-order";

export interface UpdateSaleOrderFromWebhookUseCaseInput {
  body:
    | OmieSaleOrderEvents["VendaProduto.EtapaAlterada"]
    | OmieSaleOrderEvents["VendaProduto.Alterada"]
    | OmieSaleOrderEvents["VendaProduto.Cancelada"];
}

class UpdateSaleOrderFromWebhookUseCase {
  async execute(input: UpdateSaleOrderFromWebhookUseCaseInput) {
    const body = input.body;

    console.log("UpdateSaleOrderFromWebhookUseCase");
    console.log({ body });

    const { idCliente, idPedido, valorPedido, etapa, numeroPedido } =
      body.event;

    const stringifiedSaleOrderId = idPedido.toString();

    const saleOrderToUpdate = await findOneSaleOrderUsecase.execute({
      "omie_webhook_metadata.order_id": stringifiedSaleOrderId,
    });

    if (!saleOrderToUpdate) return;

    const enterpriseHashMapped = appHashsMapping[body.appHash];

    saleOrderOmieGateway.setSecrets(OmieEnterpriseEnum[enterpriseHashMapped]);
    attachmentOmieGateway.setSecrets(OmieEnterpriseEnum[enterpriseHashMapped]);

    const saleOrderData = await saleOrderOmieGateway.find(
      stringifiedSaleOrderId
    );

    console.log(JSON.stringify({ saleOrderData }, null, 2));

    const det = saleOrderData.pedido_venda_produto?.det ?? [];

    const productsMapped = det.map(({ produto }) => ({
      id: produto.codigo_produto.toString(),
      quantity: produto.quantidade,
    }));

    console.log({ productsMapped });

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

    console.log(JSON.stringify({ attachmentsData }, null, 2));

    const attachments = attachmentsData.listaAnexos;

    console.log(JSON.stringify({ attachments }, null, 2));

    const mongoSaleOrder: Omit<ISaleOrder, "id" | "created_at"> = {
      client_id: databaseClient.id,
      products: databaseProducts.map(({ id, omie_code_metadata }) => ({
        product_id: id,
        quantity: productsMapped.find(
          (item) => item.id === omie_code_metadata?.[enterpriseHashMapped]
        )!.quantity,
      })),
      omie_webhook_metadata: {
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

    console.log(JSON.stringify({ attachments }, null, 2));

    const updatedSaleOrder = await updateOneSaleOrderUsecase.execute(
      { id: saleOrderToUpdate.id },
      mongoSaleOrder
    );

    if (etapa === "20") {
      // Etapa 20 é Separar estoque
      const productionOrderExists = await findOneProductionOrderUsecase.execute(
        {
          sale_order_id: saleOrderToUpdate.id,
        }
      );

      if (productionOrderExists?.id) {
        updateOneProductionOrderUsecase.execute(
          { id: productionOrderExists.id },
          {
            description:
              saleOrderData?.pedido_venda_produto?.observacoes?.obs_venda ??
              "Ordem de produção não possui descrição.",
          }
        );
      } else {
        createOneProductionOrderUsecase.execute({
          description:
            saleOrderData?.pedido_venda_produto?.observacoes?.obs_venda ??
            "Ordem de produção não possui descrição.",
          priority: "medium",
          stage: "in_warehouse",
          sale_order_id: saleOrderToUpdate.id,
        });
      }
    }

    console.log("UpdateSaleOrderFromWebhookUseCase - end of usecase");

    if (updatedSaleOrder.acknowledged) {
      return updatedSaleOrder;
    }
  }
}

export const updateSaleOrderFromWebhookUseCase = singleton(
  UpdateSaleOrderFromWebhookUseCase
);
