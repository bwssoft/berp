"use client";

import {
  IProduct,
  IProductionOrder,
  IFinancialOrder,
  productionOrderPriorityMapping,
  productionOrderStageMapping,
} from "@/app/lib/@backend/domain";
import {
  Button,
  ProductionOrderStepsUpdateForm,
  Select,
} from "@/app/lib/@frontend/ui";
import { formatDate } from "@/app/lib/util";
import { useProductionOrderDetails } from "../hooks";

type ProductionOrderDetailsProps = {
  productionOrder: IProductionOrder | null;
  products: IProduct[];
  saleOrder: IFinancialOrder | null;
};

export function ProductionOrderDetails({
  productionOrder,
  products,
  saleOrder,
}: ProductionOrderDetailsProps) {
  const {
    findAllProductionProcesses,
    handleSubmit,
    onProductionProcessChange,
    isEditingSelectedProcess,
    setIsEditingSelectedProcess,
  } = useProductionOrderDetails({
    productionOrder,
  });

  if (!productionOrder)
    return <p>Dados da ordem de produção não encontrados.</p>;

  const currentProductionProcess = findAllProductionProcesses.data?.find(
    ({ id }) => id === productionOrder.production_process?.[0].process_uuid
  );

  return (
    <div className="p-2">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Ordem de produção
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Aba contendo informações da ordem de produção
        </p>
      </div>

      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Identificador
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrder.id}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Estágio de produção
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrderStageMapping[productionOrder.stage]}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Prioridade
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrderPriorityMapping[productionOrder.priority]}
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
              {formatDate(new Date(productionOrder.created_at), {
                includeHours: true,
              })}
            </dd>
          </div>

          {currentProductionProcess && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-semibold leading-6 text-gray-900">
                Processo de produção
              </dt>

              <dd className="flex flex-row items-center gap-4 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <p>{currentProductionProcess?.name}</p>

                {!isEditingSelectedProcess && (
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-500"
                    onClick={() => setIsEditingSelectedProcess(true)}
                  >
                    Alterar processo
                  </Button>
                )}
              </dd>
            </div>
          )}

          <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
            <dt className="text-sm font-semibold leading-6 text-gray-900">
              {isEditingSelectedProcess
                ? "Alteração de processo de produção"
                : "Progresso das etapas"}
            </dt>

            <dd className="flex flex-row items-center gap-4 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {!productionOrder.production_process && (
                <div className="text-sm flex flex-col gap-2">
                  <p>
                    Nenhum processo de produção associado a essa ordem de
                    produção. Associe um processo de produção para poder ver e
                    editar o progresso das etapas.
                  </p>

                  <Select
                    data={findAllProductionProcesses.data ?? []}
                    placeholder="Selecione um processo de produção"
                    keyExtractor={(item) => item.id}
                    labelExtractor={(item) => item.name}
                    valueExtractor={(item) => item.id}
                    onChangeSelect={(item) => onProductionProcessChange(item)}
                  />

                  <Button
                    className="bg-indigo-600 hover:bg-indigo-500"
                    onClick={() => handleSubmit()}
                  >
                    Salvar
                  </Button>
                </div>
              )}

              {productionOrder.production_process &&
                currentProductionProcess && (
                  <div className="text-sm">
                    {isEditingSelectedProcess && (
                      <div className="flex flex-row items-end gap-2">
                        <Select
                          data={findAllProductionProcesses.data ?? []}
                          placeholder="Selecione um processo de produção"
                          keyExtractor={(item) => item.id}
                          labelExtractor={(item) => item.name}
                          valueExtractor={(item) => item.id}
                          onChangeSelect={(item) => {
                            onProductionProcessChange(item);
                          }}
                        />

                        <Button
                          className="h-9 bg-indigo-600 hover:bg-indigo-500"
                          onClick={() => {
                            handleSubmit();
                            setIsEditingSelectedProcess(false);
                          }}
                        >
                          Salvar
                        </Button>

                        <Button
                          className="h-9 bg-indigo-600 hover:bg-indigo-500"
                          onClick={() => {
                            setIsEditingSelectedProcess(false);
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}

                    {!isEditingSelectedProcess && (
                      <ProductionOrderStepsUpdateForm
                        productionOrder={productionOrder}
                      />
                    )}
                  </div>
                )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
