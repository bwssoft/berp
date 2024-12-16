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
import { createFinancialOrderFromProposal } from "@/app/lib/@backend/action";
import { IFinancialOrder } from "@/app/lib/@backend/domain";
import { saleOrderConstants } from "@/app/lib/constant/sale-order";
import { Button } from "../../../component";

interface Props {
  proposal_id: string;
  scenario_id?: string;
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
                  Processo de criação do pedido
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Acompanhe a criação do pedido dessa proposta
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180 w-full sm:w-auto" />
              </div>
            </DisclosureButton>
            <DisclosurePanel>
              {financial_order?.id ? (
                <div>
                  {financial_order.line_items_processed.map((line, idx) => (
                    <div
                      key={line.enterprise_id + idx}
                      className="mt-6 border-t border-gray-100"
                    >
                      <p className="my-6 max-w-2xl text-sm/6 text-gray-500">
                        Pedido {idx + 1}º
                      </p>
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
                              className="block w-full rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                        {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm/6 font-medium text-gray-900">
                            Salary expectation
                          </dt>
                          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            $120,000
                          </dd>
                        </div> */}
                      </dl>
                    </div>
                  ))}
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Cancelar
                    </button>
                    <Button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Salvar Pedidos de Venda
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
                          onClick={async () =>
                            scenario_id &&
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
