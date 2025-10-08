"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useFinancialOrderCreateFromProposal } from "./use-financial-order-from-proposal-create-form";
import {
  ChevronDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { IFinancialOrder } from "@/app/lib/@backend/domain";
import { saleOrderConstants } from "@/app/lib/constant/sale-order";
import { Button } from '@/frontend/ui/component/button';

import { createFinancialOrderFromProposal } from "@/app/lib/@backend/action/financial/financial-order.action";

interface Props {
  proposal_id: string;
  scenario_id: string;
  financial_order?: IFinancialOrder;
}

export function FinancialOrderFromProposalCreateForm(props: Props) {
  const { proposal_id, scenario_id, financial_order } = props;
  const { handleSubmit, register } = useFinancialOrderCreateFromProposal({
    defaultValues: financial_order,
    proposal_id,
  });
  return (
    <form action={() => handleSubmit()} className="mt-12">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <Disclosure>
            <DisclosureButton className="group flex w-full items-center justify-between flex-wrap sm:flex-nowrap">
              <div className="w-full text-start">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Ordem Financeira
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Acompanhe a ordem financeira dessa proposta
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180 w-full sm:w-auto" />
              </div>
            </DisclosureButton>
            <DisclosurePanel>
              {financial_order?.id ? (
                <div>
                  <div className="mt-12 px-4 sm:px-0">
                    <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                      PV Nº {financial_order.code}
                    </p>
                  </div>
                  {financial_order.line_items_processed.map((line, idx) => (
                    <div
                      key={line.enterprise_id + idx}
                      className="mt-6 border-t border-gray-100"
                    >
                      <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Empresa do Grupo
                          </dt>
                          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {(line as any).enterprise.short_name}
                          </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Tipo de negociação
                          </dt>
                          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {(line as any).negotiation_type.label}
                          </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Itens
                          </dt>
                          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {line.items
                              .map((item) => (item as any).product.name)
                              .join(", ")}
                          </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Quantidade de Parcelas
                          </dt>
                          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <select
                              id="installment_quantity"
                              className="block w-full rounded-md border-0 py-2 pl-2 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-xs sm:leading-6"
                              {...register(
                                `line_items_processed.${idx}.installment_quantity`
                              )}
                            >
                              {saleOrderConstants.financialOrderIntallment.map(
                                (c) => (
                                  <option key={c.id} value={c.value}>
                                    {c.label}
                                  </option>
                                )
                              )}
                            </select>
                          </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Valor de entrada
                          </dt>
                          <div className="relative rounded-md shadow-sm w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-xs">
                                R$
                              </span>
                            </div>
                            <input
                              type="text"
                              id="entry_amout"
                              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-xs sm:leading-6"
                              placeholder="0.00"
                              aria-describedby="value-currency"
                              {...register(
                                `line_items_processed.${idx}.entry_amount`
                              )}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <span
                                className="text-gray-500 sm:text-xs"
                                id="price-currency"
                              >
                                BRL
                              </span>
                            </div>
                          </div>
                        </div>
                      </dl>
                    </div>
                  ))}
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button
                      type="submit"
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Salvar PV Nº {financial_order.code}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-md bg-gray-100 border border-gray-200 px-6 py-3">
                  <div className="flex">
                    <div className="shrink-0">
                      <InformationCircleIcon
                        aria-hidden="true"
                        className="size-5 text-gray-400"
                      />
                    </div>
                    <div className="ml-6 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-gray-700">
                        Essa proposta ainda não tem um pedido de venda
                        associado.
                      </p>
                      <p className="mt-3 text-sm md:ml-6 md:mt-0">
                        <button
                          type="button"
                          onClick={() =>
                            createFinancialOrderFromProposal({
                              proposal_id: proposal_id,
                              scenario_id: scenario_id,
                            })
                          }
                          className="whitespace-nowrap font-medium text-gray-700 hover:text-gray-600"
                        >
                          Associar
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
    </form>
  );
}
