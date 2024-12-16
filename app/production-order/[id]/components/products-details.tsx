"use client";

import { IInput, IProduct, ITechnicalSheet } from "@/app/lib/@backend/domain";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DataTable,
} from "@/app/lib/@frontend/ui/component";
import { formatDate } from "@/app/lib/util";

type InputId = string;

type ProductsDetailsProps = {
  products: IProduct[];
  technicalSheets: ITechnicalSheet[];
  inputs: IInput[];
};

export function ProductsDetails({
  products,
  technicalSheets,
  inputs,
}: ProductsDetailsProps) {
  if (products.length === 0) return <p>Nenhum produto associado.</p>;

  const inputsReduced: Record<InputId, { name: string; measure_unit: string }> =
    inputs.reduce((acc, current) => {
      acc[current.id] = {
        name: current.name,
        measure_unit: current.measure_unit,
      };

      return acc;
    }, {} as Record<InputId, { name: string; measure_unit: string }>);

  return (
    <div className="p-2">
      <div className="px-4 mb-6 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Produtos e fichas técnicas
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Aba contendo informações dos produtos e suas fichas técnicas
        </p>
      </div>

      <Accordion type="single" collapsible>
        {products.map((product) => {
          const productTechnicalSheet = technicalSheets.find(
            ({ product_id }) => product_id === product.id
          );

          return (
            <AccordionItem key={product.id} value={product.id}>
              <AccordionTrigger className="text-sm font-semibold text-gray-800">
                {product.name}
              </AccordionTrigger>

              <AccordionContent>
                <dl className="p-2 divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Nome do produto
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {product.name}
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

                  <div className="items-center px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Cor
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: product.color }}
                      />
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
                      Ficha técnica
                    </p>

                    <div className="flex mt-1 text-sm leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                      <DataTable
                        data={productTechnicalSheet?.inputs ?? []}
                        columns={[
                          {
                            header: "Insumo",
                            accessorKey: "uuid",
                            cell: ({ row }) => {
                              const input = row.original;

                              return inputsReduced[input.uuid].name;
                            },
                          },
                          {
                            header: "Quantidade",
                            accessorKey: "quantity",
                            cell: ({ row }) => {
                              const input = row.original;

                              return `${input.quantity} ${
                                inputsReduced[input.uuid].measure_unit
                              }`;
                            },
                          },
                        ]}
                        mobileDisplayValue={(data) => data.uuid}
                        mobileKeyExtractor={(data) => data.uuid}
                        className="w-full"
                      />
                    </div>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
