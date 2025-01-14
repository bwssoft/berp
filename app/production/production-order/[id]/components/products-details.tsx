"use client";

import { IProduct } from "@/app/lib/@backend/domain";
import { ProductProcessToProduceTable, ProductBOMTable } from "@/app/lib/@frontend/ui/table";
import { formatDate } from "@/app/lib/util";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type ProductsDetailsProps = {
  product: {
    id: string
    name: string
    color: string
    description: string
    created_at: Date
    process_execution?: IProduct["process_execution"]
    bom?: {
      input: {
        id: string
        name: string
      }
      quantity: number
    }[]
  };
};

export function ProductsDetails({
  product,
}: ProductsDetailsProps) {
  const hasBOM = Array.isArray(product.bom) && product.bom.length > 0
  const hasProcessExecution = Array.isArray(product.process_execution) && product.process_execution.length > 0
  return (
    <div className="p-2">
      <div className="px-4 mb-6 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Produto
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Aba contendo informações do produto
        </p>
      </div>
      <dl className="divide-y divide-gray-100">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Nome do produto
          </dt>
          <dd className="flex gap-2 items-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: product.color }}
            />
            <p className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{product.name}</p>
          </dd>
        </div>

        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Descrição
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {product.description}
          </dd>
        </div>

        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Data de criação
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {formatDate(new Date(product.created_at), {
              includeHours: true,
            })}
          </dd>
        </div>

        <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
          <p className="text-sm font-medium leading-6 text-gray-900">
            B.O.M
          </p>
          <div className="flex mt-1 text-sm leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
            {hasBOM ? <ProductBOMTable data={product.bom!} /> : <div className="mt-4 rounded-md bg-gray-100 border border-gray-200 px-6 py-3">
              <div className="flex">
                <div className="shrink-0">
                  <InformationCircleIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                </div>
                <div className="ml-6 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-gray-700">
                    Esse produto ainda não tem a B.O.M definida.
                  </p>
                  <p className="mt-3 text-sm md:ml-6 md:mt-0">
                    <Link
                      href={`/product/form/update?id=${product.id}`}
                      className="whitespace-nowrap font-medium text-gray-700 hover:text-gray-600"
                    >
                      Definir B.O.M
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>}
          </div>
        </div>

        <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
          <p className="text-sm font-medium leading-6 text-gray-900">
            Processo para Produzir
          </p>
          <div className="flex mt-1 text-sm leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
            {hasProcessExecution ? <ProductProcessToProduceTable data={product.process_execution!} /> : <div className="mt-4 rounded-md bg-gray-100 border border-gray-200 px-6 py-3">
              <div className="flex">
                <div className="shrink-0">
                  <InformationCircleIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                </div>
                <div className="ml-6 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-gray-700">
                    Esse produto ainda não tem o processo produtivo definido.
                  </p>
                  <p className="mt-3 text-sm md:ml-6 md:mt-0">
                    <Link
                      href={`/product/form/update?id=${product.id}`}
                      className="whitespace-nowrap font-medium text-gray-700 hover:text-gray-600"
                    >
                      Definir Processo Produtivo
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </dl>
    </div>
  );
}
