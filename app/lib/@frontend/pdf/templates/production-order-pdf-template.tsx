"use client";
import {IClient} from "@/backend/domain/commercial/entity/client.definition";
import {IProduct} from "@/backend/domain/commercial/entity/product.definition";
import {IFinancialOrder, saleOrderStageMapping} from "@/backend/domain/financial/entity/financial-order.definition";
import {IProductionOrder} from "@/backend/domain/production/entity/production-order.definition";
import {ITechnology} from "@/backend/domain/engineer/entity/technology.definition";
import {IProductCategory} from "@/backend/domain/commercial/entity/product.category.definition";
import {} from "@/backend/domain/admin/entity/control.definition";
import { productionOrderConstants } from "@/app/lib/constant";
import { formatDate } from "@/app/lib/util";
import { PageBreak, Tailwind } from "@fileforge/react-print";

type ProductionOrderPdfTemplateProps = {
  productionOrder: IProductionOrder;
  client: IClient;
  product: {
    id: string;
    name: string;
    color: string;
    description?: string;
    created_at: Date;
    technology: Pick<ITechnology, "name" | "id">;
    category: Pick<IProductCategory, "name" | "id">;
    bom?: {
      input_id: string;
      input_name: string;
      quantity: number;
    }[];
  };
};

export function ProductionOrderPdfTemplate({
  productionOrder,
  product,
  client,
}: ProductionOrderPdfTemplateProps) {
  return (
    <Tailwind>
      <ProductionOrderSection
        productionOrder={productionOrder}
        product={product}
      />

      <PageBreak />

      <ClientSection client={client} />

      <PageBreak />

      <InputsSection product={product} />
    </Tailwind>
  );
}

type InputsSectionProps = {
  product: {
    id: string;
    name: string;
    technology: Pick<ITechnology, "name" | "id">;
    category: Pick<IProductCategory, "name" | "id">;
    bom?: {
      input_id: string;
      input_name: string;
      quantity: number;
    }[];
  };
};

function InputsSection({ product }: InputsSectionProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-gray-800 font-bold text-2xl">
        Detalhes dos materiais
      </h1>
      <div key={product.id} className="divide-gray-100 mt-10">
        <p className="text-lg font-semibold text-gray-800">{product.name}</p>

        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Insumo
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
            Quantidade
          </dd>
        </div>

        {product.bom?.map((bom, idx) => (
          <div
            key={bom.input_id + idx}
            className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
          >
            <dt className="text-sm font-medium leading-6 text-gray-900">
              {bom.input_name}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
              {bom.quantity}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}

type ProductionOrderSectionProps = {
  productionOrder: IProductionOrder;
  product: { id: string; name: string; color: string };
};

function ProductionOrderSection({
  productionOrder,
  product,
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
              {productionOrder.code.toString().padStart(5, "0")}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Estágio de produção
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrderConstants.stage[productionOrder.stage]}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Prioridade
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrderConstants.priority[productionOrder.priority]}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Observação
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrder.description}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Produtos
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div
                key={product.id}
                className="flex items-center gap-1 font-semibold text-gray-800"
              >
                <p>{productionOrder.total_quantity} -</p>

                <div className="flex items-center gap-2">
                  <p>{product.name}</p>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: product.color }}
                  />
                </div>
              </div>
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Data de criação
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDate(new Date(productionOrder.created_at), {
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
  const clientBillingAddresss = client.address;

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
              {client.company_name ?? client.trade_name}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Registro municipal
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {client?.tax_details?.municipal_registration ?? "--"}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Registro estadual
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {client?.tax_details?.state_registration ?? "--"}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Endereço de cobrança
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              Rua {clientBillingAddresss?.street}, {clientBillingAddresss?.city}
              , {clientBillingAddresss?.state} -{" "}
              {clientBillingAddresss?.postal_code} -{" "}
              {clientBillingAddresss?.country}
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
  saleOrder: IFinancialOrder;
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
              Nome do vendedor
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {saleOrder.omie_webhook_metadata.vendor_name}
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

