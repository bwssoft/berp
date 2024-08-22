import { ISaleOrder } from "@/app/lib/@backend/domain";
import { OmieEnterpriseEnum } from "@/app/lib/@backend/domain/@shared/gateway/omie/omie.gateway.interface";
import { OmieSaleOrderEvents } from "@/app/lib/@backend/domain/@shared/webhook/omie/omie-sale-order.webhook.interface";
import {
  attachmentOmieGateway,
  saleOrderOmieGateway,
} from "@/app/lib/@backend/gateway/omie";
import {
  createOneSaleOrderUsecase,
  findManyProductUsecase,
  findOneClientUsecase,
} from "@/app/lib/@backend/usecase";
import { appHashsMapping } from "@/app/lib/constant/app-hashs";
import { saleOrderConstants } from "@/app/lib/constant/sale-order";

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as OmieSaleOrderEvents[keyof OmieSaleOrderEvents];

    const { idCliente, idPedido, valorPedido, etapa, numeroPedido } =
      body.event;

    const enterpriseHashMapped = appHashsMapping[body.appHash];

    saleOrderOmieGateway.setSecrets(OmieEnterpriseEnum[enterpriseHashMapped]);
    attachmentOmieGateway.setSecrets(OmieEnterpriseEnum[enterpriseHashMapped]);

    const stringifiedSaleOrderId = idPedido.toString();

    const saleOrderData = await saleOrderOmieGateway.find(
      stringifiedSaleOrderId
    );

    const productsMapped = saleOrderData.pedido_venda_produto.det.map(
      ({ produto }) => ({
        id: produto.codigo_produto.toString(),
        quantity: produto.quantidade,
      })
    );

    const productsIds = productsMapped.map(({ id }) => id);

    const databaseProducts = await findManyProductUsecase.execute({
      [`omie_code_metadata.${enterpriseHashMapped}`]: {
        $in: productsIds,
      },
    });

    const databaseClient = await findOneClientUsecase.execute({
      [`omie_code_metadata.${enterpriseHashMapped}`]: idCliente.toString(),
    });

    if (databaseProducts.length === 0 || databaseClient === null) {
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

    await createOneSaleOrderUsecase.execute(mongoSaleOrder);
  } catch (error) {
    console.error(error);
  }
}
