"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useCreateProductionOrderCreateFromProposal } from "./use-production-order-from-proposal-create-form";
import {
  ChevronDownIcon,
  InformationCircleIcon,
  LinkIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { createProductionOrderFromProposal } from "@/app/lib/@backend/action";
import { IConfigurationProfile, IProduct, IProductionOrder } from "@/app/lib/@backend/domain";
import { Button, Error } from "../../../../component";
import { Combobox } from "@bwsoft/combobox"
import { Controller } from "react-hook-form";
import { nanoid } from "nanoid";

interface ProductionOrderFromProposalCreateFormProps {
  proposal_id: string;
  scenario_id: string;
  production_orders: (IProductionOrder & { product: { name: string } })[];
  configuration_profiles: IConfigurationProfile[]
}

export function ProductionOrderFromProposalCreateForm(props: ProductionOrderFromProposalCreateFormProps) {
  const { proposal_id, scenario_id, production_orders, configuration_profiles } = props;

  return (
    <div className="space-y-12 mt-12">
      <div className="border-b border-gray-900/10 pb-12">
        <Disclosure>
          <DisclosureButton className="group flex w-full items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="w-full text-start">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Ordens de produção
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Acompanhe as ordens de produção dessa proposta
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180 w-full sm:w-auto" />
            </div>
          </DisclosureButton>
          <DisclosurePanel>
            {production_orders?.length ? <div>
              {production_orders.map(p => <UpdateProductionOrderFromProposalForm key={p.id} production_order={p} configuration_profiles={configuration_profiles}/>)}
            </div> : (
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
                      Essa proposta ainda não nenhuma ordem de produção associada.
                    </p>
                    <p className="mt-3 text-sm md:ml-6 md:mt-0">
                      <button
                        type="button"
                        onClick={() => createProductionOrderFromProposal({
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

  );
}


interface UpdateProductionOrderFromProposalForm {
  production_order: IProductionOrder & { product: { name: string } };
  configuration_profiles: IConfigurationProfile[]
}

export function UpdateProductionOrderFromProposalForm(props: UpdateProductionOrderFromProposalForm) {
  const { production_order, configuration_profiles } = props;
  const {
    handleSubmit,
    lineItemsOnForm,
    handleAppendLineItem,
    handleRemoveLineItem,
    register,
    control,
    errors
  } = useCreateProductionOrderCreateFromProposal({
    defaultValues: production_order
  });
  return (
    <form action={() => handleSubmit()} className="mt-12">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div>
            <div className="px-4 sm:px-0">
              <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">OP Nº {production_order.code}</p>
            </div>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Produto</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{production_order?.product?.name ?? "--"}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Quantitdade Total</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{production_order.total_quantity}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Descrição</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <textarea
                      {...register("description")}
                      id="description"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                      placeholder="Insira uma descrição para essa ordem de produção."
                    />
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">
                    Configurações
                    <button
                      title="Adicionar nova linha"
                      className="ml-2 p-2 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      type="button"
                      onClick={() => handleAppendLineItem({
                          parcial_quantity: 0,
                          is_shared: false,
                          id: nanoid()
                        })}>
                      <PlusCircleIcon height={16} width={16} />
                    </button>
                  </dt>
                  <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                      {lineItemsOnForm.map((lineItem, lineItemIdx) => <li key={lineItem.id} className="flex items-end justify-between py-4 pl-4 pr-5 text-sm/6">
                        <div className="flex w-0 flex-1 items-center gap-2">
                          <div className="flex-1">
                            {lineItemIdx === 0 && <label
                              htmlFor={"configuration_profile" + lineItem.id + lineItemIdx}
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Perfil
                            </label>}
                            <div className="mt-2">
                              <Controller 
                                control={control}
                                name={`line_items.${lineItemIdx}.configuration_profile_id`}
                                render={({field}) => <Combobox
                                  data={configuration_profiles}
                                  displayValueGetter={(profile) => profile?.name!}
                                  keyExtractor={(profile) => profile?.name!}
                                  placeholder="Escolha um perfil"
                                  type="single"
                                  behavior="search"
                                  onOptionChange={([profile]) => field.onChange(profile?.id!)}
                                  error={errors?.line_items?.[lineItemIdx]?.configuration_profile_id?.message ?? ""}
                                  defaultValue={[configuration_profiles.find(el => el.id === lineItem.configuration_profile_id)]}
                                />}
                              />
                              <div className="flex items-center gap-2 mt-2">
                                <LinkIcon height={16} width={16} className="text-blue-600 hover:text-blue-800"/>
                                <p className="underline text-xs text-blue-600 cursor-pointer hover:text-blue-800">Prencher perfil por compartilhamento</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            {lineItemIdx === 0 && <label
                              htmlFor={"quantity" + lineItem.id + lineItemIdx}
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Quantidade
                            </label>}
                            <div className="mt-2">
                              <input
                                {...register(`line_items.${lineItemIdx}.parcial_quantity`)}
                                type="number"
                                placeholder="50"
                                id={"quantity" + lineItem.id + lineItemIdx}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              <Error message={errors?.line_items?.[lineItemIdx]?.parcial_quantity?.message} />
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 shrink-0">
                          <button
                            onClick={() => handleRemoveLineItem(lineItemIdx)}
                            className="text-sm text-gray-700 hover:text-gray-500 hover:underline w-full sm:w-auto sm:ml-2 sm:pl-2 text-start text-nowrap">
                            Remover
                          </button>
                        </div>
                      </li>)}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Salvar OP Nº {production_order.code}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
