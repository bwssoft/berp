"use client";

import {IProduct} from "@/backend/domain/commercial/entity/product.definition";

type ProcessExecutionProps = {};

export function ProcessExecution({
}: ProcessExecutionProps) {
  return (
    <div className="p-2">
      <div className="px-4 mb-6 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Execução do Processo Produtivo
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Aba contendo as etapas a serem seguidas para produzir
        </p>
      </div>
      <dl className="divide-y divide-gray-100">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Nome do produto
          </dt>
          <dd className="flex gap-2 items-center">
            <p className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">name</p>
          </dd>
        </div>

      </dl>
    </div>
  );
}
