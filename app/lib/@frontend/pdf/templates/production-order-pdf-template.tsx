"use client";
import {
  clientSectorMapping,
  clientTypeMapping,
  IClient,
  IProduct,
  IProductionOrder,
  ISaleOrder,
  productionOrderPriorityMapping,
  productionOrderStageMapping,
  saleOrderStageMapping,
} from "@/app/lib/@backend/domain";
import { formatDate } from "@/app/lib/util";
import { PageBreak, Tailwind } from "@fileforge/react-print";

type ProductionOrderPdfTemplateProps = {
  productionOrder: IProductionOrder | null;
  products: IProduct[];
  saleOrder: ISaleOrder | null;
  client: IClient | null;
};

export function ProductionOrderPdfTemplate({
  productionOrder,
  products,
  saleOrder,
  client,
}: ProductionOrderPdfTemplateProps) {
  return (
    <Tailwind>
      <ProductionOrderSection
        productionOrder={productionOrder}
        products={products}
        saleOrder={saleOrder}
      />

      <PageBreak />

      <ClientSection client={client!} />

      <PageBreak />

      <SaleOrderSection saleOrder={saleOrder!} />
    </Tailwind>
  );
}

type ProductionOrderSectionProps = {
  productionOrder: IProductionOrder | null;
  products: IProduct[];
  saleOrder: ISaleOrder | null;
};

function ProductionOrderSection({
  productionOrder,
  products,
  saleOrder,
}: ProductionOrderSectionProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-gray-800 font-bold text-2xl">
        Detalhes da ordem de produção
      </h1>

      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Identificador
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrder!.id}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Estágio de produção
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrderStageMapping[productionOrder!.stage]}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Prioridade
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrderPriorityMapping[productionOrder!.priority]}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Número da ordem de serviço (OMIE)
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {saleOrder!.omie_webhook_metadata.order_number}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Observação
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrder!.description}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Produtos
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-1 font-semibold text-gray-800"
                >
                  <p>
                    {
                      saleOrder?.products.find(
                        (saleOrderProduct) =>
                          saleOrderProduct.product_id === product.id
                      )?.quantity
                    }{" "}
                    -
                  </p>

                  <div className="flex items-center gap-2">
                    <p>{product.name}</p>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: product.color }}
                    />
                  </div>
                </div>
              ))}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Data de criação
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDate(new Date(productionOrder!.created_at), {
                includeHours: true,
              })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

type ClientSectionProps = {
  client: IClient;
};

function ClientSection({ client }: ClientSectionProps) {
  const clientBillingAddresss = client.billing_address;

  return (
    <div className="flex flex-col">
      <h1 className="text-gray-800 font-bold text-2xl">Detalhes do cliente</h1>

      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Identificador
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {client.id}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Documento{" "}
              <span className="text-gray-400 font-normal">
                ({client.document.type})
              </span>
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {client.document.value}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Nome
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {client.corporate_name}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Registro municipal
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {client.municipal_registration}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Registro estadual
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {client.municipal_registration}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Descrição
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {client.description}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Classificação
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {clientTypeMapping[client.type]}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Setor / ramo
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {clientSectorMapping[client.sector]}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Endereço de cobrança
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              Rua {clientBillingAddresss.street}, {clientBillingAddresss.city},{" "}
              {clientBillingAddresss.state} -{" "}
              {clientBillingAddresss.postal_code} -{" "}
              {clientBillingAddresss.country}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Data de criação
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDate(new Date(client.created_at), {
                includeHours: true,
              })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

type SaleOrderSectionProps = {
  saleOrder: ISaleOrder;
};

function SaleOrderSection({ saleOrder }: SaleOrderSectionProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-gray-800 font-bold text-2xl">
        Detalhes da ordem de serviço
      </h1>

      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Identificador
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {saleOrder.id}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Id do cliente (OMIE)
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {saleOrder.omie_webhook_metadata.client_id}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Número da ordem de serviço (OMIE)
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {saleOrder.omie_webhook_metadata.order_number}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Id da ordem de serviço (OMIE)
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {saleOrder.omie_webhook_metadata.order_id}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Etapa
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {saleOrderStageMapping[saleOrder.omie_webhook_metadata.stage]}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Empresa
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {saleOrder.omie_webhook_metadata.enterprise}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Data de criação
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDate(new Date(saleOrder.created_at), {
                includeHours: true,
              })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
