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
import {IClient} from "@/app/lib/@backend/domain/commercial/entity/client.definition";
import {IConfigurationProfile} from "@/app/lib/@backend/domain/engineer/entity/configuration-profile.definition";
import {IProduct} from "@/app/lib/@backend/domain/commercial/entity/product.definition";
import {IProductionOrder} from "@/app/lib/@backend/domain/production/entity/production-order.definition";
import {ITechnology} from "@/app/lib/@backend/domain/engineer/entity/technology.definition";
import {} from "@/app/lib/@backend/domain/admin/entity/control.definition";
import { Button } from '@/frontend/ui/component/button';
import { Combobox } from '@/frontend/ui/component/combobox/index';
import { Error } from '@/frontend/ui/component/error';

import { Controller } from "react-hook-form";
import { nanoid } from "nanoid";
import Link from "next/link";
import { createProductionOrderFromProposal } from "@/app/lib/@backend/action/production/production-order.action";

interface ProductionOrderFromProposalCreateFormProps {
  proposal_id: string;
  scenario_id: string;
  production_orders: (IProductionOrder & {
    product: {
      name: string;
    };
    technology: {
      id: string;
      name: { brand: string };
    };
  })[];
  client_id: string;
  client_document_value: string;
  configuration_profiles: IConfigurationProfile[];
}

export function ProductionOrderFromProposalCreateForm(
  props: ProductionOrderFromProposalCreateFormProps
) {
  const {
    proposal_id,
    scenario_id,
    production_orders,
    configuration_profiles,
    client_id,
    client_document_value,
  } = props;

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
            {production_orders?.length ? (
              <div>
                {production_orders.map((p) => (
                  <UpdateProductionOrderFromProposalForm
                    key={p.id}
                    production_order={p}
                    configuration_profiles={configuration_profiles}
                    client_id={client_id}
                    proposal_id={proposal_id}
                    client_document_value={client_document_value}
                    technology_brand_name={p.technology.name.brand}
                  />
                ))}
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
                      Essa proposta ainda não nenhuma ordem de produção
                      associada.
                    </p>
                    <p className="mt-3 text-sm md:ml-6 md:mt-0">
                      <button
                        type="button"
                        onClick={() =>
                          createProductionOrderFromProposal({
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
  production_order: IProductionOrder & {
    product: {
      name: string;
    };
    technology: {
      id: string;
    };
  };
  client_id: string;
  configuration_profiles: IConfigurationProfile[];
  proposal_id: string;
  client_document_value: string;
  technology_brand_name: string;
}

export function UpdateProductionOrderFromProposalForm(
  props: UpdateProductionOrderFromProposalForm
) {
  const {
    production_order,
    configuration_profiles,
    client_id,
    proposal_id,
    client_document_value,
    technology_brand_name,
  } = props;
  const {
    handleSubmit,
    lineItemsOnForm,
    handleAppendLineItem,
    handleRemoveLineItem,
    register,
    control,
    errors,
    handleCreateConfigurationProfile,
    handleDeleteConfigurationProfile,
  } = useCreateProductionOrderCreateFromProposal({
    defaultValues: production_order,
    client_document_value,
    technology_brand_name,
  });
  return (
    <form action={() => handleSubmit()} className="mt-12">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div>
            <div className="px-4 sm:px-0">
              <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                OP Nº {production_order.code}
              </p>
            </div>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">
                    Produto
                  </dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {production_order?.product?.name ?? "--"}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">
                    Quantitdade Total
                  </dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {production_order.total_quantity}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">
                    Descrição
                  </dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <textarea
                      {...register("description")}
                      id="description"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      onClick={() =>
                        handleAppendLineItem({
                          configuration_profile_id: "",
                          parcial_quantity: 0,
                          id: nanoid(),
                        })
                      }
                    >
                      <PlusCircleIcon height={16} width={16} />
                    </button>
                  </dt>
                  <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul
                      role="list"
                      className="divide-y divide-gray-100 rounded-md border border-gray-200"
                    >
                      {lineItemsOnForm.map((lineItem, lineItemIdx) => (
                        <li
                          key={lineItem.id}
                          className="flex items-end justify-between py-4 pl-4 pr-5 text-sm/6"
                        >
                          <div className="flex w-0 flex-1 items-center gap-2">
                            <div className="flex-1">
                              {lineItemIdx === 0 && (
                                <label
                                  htmlFor={
                                    "configuration_profile" +
                                    lineItem.id +
                                    lineItemIdx
                                  }
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Perfil
                                </label>
                              )}
                              <div className="mt-2">
                                <Controller
                                  control={control}
                                  // key={lineItem.id + lineItemIdx}
                                  name={`line_items.${lineItemIdx}.configuration_profile_id`}
                                  render={({ field: { onChange, value } }) => (
                                    <Combobox
                                      data={configuration_profiles}
                                      displayValueGetter={(profile) =>
                                        profile?.name!
                                      }
                                      keyExtractor={(profile) => profile?.name!}
                                      placeholder="Escolha um perfil"
                                      type="single"
                                      behavior="search"
                                      // Aqui usamos a propriedade value para refletir o estado atual
                                      value={configuration_profiles.filter(
                                        (profile) => profile.id === value
                                      )}
                                      onOptionChange={([profile]) =>
                                        onChange(profile?.id!)
                                      }
                                      error={
                                        errors?.line_items?.[lineItemIdx]
                                          ?.configuration_profile_id?.message ??
                                        ""
                                      }
                                    />
                                  )}
                                />

                                <div className="mt-2">
                                  {lineItem.configuration_profile_id ? (
                                    <>
                                      <Link
                                        href={`/engineer/configuration-profile/form/update-from-production-order?configuration_profile_id=${lineItem.configuration_profile_id}&production_order_id=${production_order.id}&production_order_line_item_id=${lineItem.id}`}
                                        className="underline text-xs text-blue-600 cursor-pointer hover:text-blue-800"
                                      >
                                        Acompanhar
                                      </Link>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteConfigurationProfile({
                                            configuration_profile_id:
                                              lineItem.configuration_profile_id!,
                                            line_item_id: lineItem.id,
                                            production_order_id:
                                              production_order.id,
                                            proposal_id,
                                          })
                                        }
                                        className="ml-2 underline text-xs text-red-600 cursor-pointer hover:text-red-800"
                                      >
                                        Cancelar
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await handleCreateConfigurationProfile({
                                          client_id,
                                          technology_id:
                                            production_order.technology.id,
                                          line_item_id: lineItem.id,
                                          production_order_id:
                                            production_order.id,
                                          proposal_id,
                                        });
                                      }}
                                      className="flex items-center gap-2 underline text-xs text-blue-600 cursor-pointer hover:text-blue-800"
                                    >
                                      <LinkIcon
                                        height={14}
                                        width={14}
                                        className="text-blue-600 hover:text-blue-800"
                                      />
                                      Prencher perfil por compartilhamento
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              {lineItemIdx === 0 && (
                                <label
                                  htmlFor={
                                    "quantity" + lineItem.id + lineItemIdx
                                  }
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Quantidade
                                </label>
                              )}
                              <div className="mt-2">
                                <input
                                  {...register(
                                    `line_items.${lineItemIdx}.parcial_quantity`
                                  )}
                                  type="number"
                                  placeholder="50"
                                  id={"quantity" + lineItem.id + lineItemIdx}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                                <Error
                                  message={
                                    errors?.line_items?.[lineItemIdx]
                                      ?.parcial_quantity?.message
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 shrink-0">
                            <button
                              onClick={() => handleRemoveLineItem(lineItemIdx)}
                              className="text-sm text-gray-700 hover:text-gray-500 hover:underline w-full sm:w-auto sm:ml-2 sm:pl-2 text-start text-nowrap"
                            >
                              Remover
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
