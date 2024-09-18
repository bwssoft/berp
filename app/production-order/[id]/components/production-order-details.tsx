"use client";

import { useQuery } from "@tanstack/react-query";

import { findAllProductionProcess } from "@/app/lib/@backend/action";
import {
  IProductionOrder,
  productionOrderPriorityMapping,
  productionOrderStageMapping,
} from "@/app/lib/@backend/domain";
import { Select } from "@/app/lib/@frontend/ui";
import { formatDate } from "@/app/lib/util";

type ProductionOrderDetailsProps = {
  productionOrder: IProductionOrder | null;
};

export function ProductionOrderDetails({
  productionOrder,
}: ProductionOrderDetailsProps) {
  const findAllProductionProcesses = useQuery({
    queryKey: ["findAllProductionProcesses"],
    queryFn: () => findAllProductionProcess(),
  });

  if (!productionOrder)
    return <p>Dados da ordem de produção não encontrados.</p>;

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
              Descrição
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {productionOrder.description}
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

          <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
            <p className="text-sm font-medium leading-6 text-gray-900">
              Processo de produção
            </p>

            {!productionOrder.production_process && (
              <div className="text-sm">
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
                  onChangeSelect={(item) => console.log({ item })}
                />
              </div>
            )}
          </div>
        </dl>
      </div>
    </div>
  );
}
