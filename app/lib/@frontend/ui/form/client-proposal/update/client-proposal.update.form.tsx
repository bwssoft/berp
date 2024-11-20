"use client";
import { Button } from "../../../button";
import {
  ClientProposalSchema,
  useClientProposalUpdateForm,
} from "./use-client-proposal-update-form";
import {
  Currency,
  IClient,
  IProduct,
  IProposal,
} from "@/app/lib/@backend/domain";
import { clientConstants } from "@/app/lib/constant";
import { cn } from "@/app/lib/util";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Control,
  useFieldArray,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { createOneProposalDocument } from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";

interface Props {
  clients: IClient[];
  products: IProduct[];
  proposal: IProposal;
}
export function ClientProposalUpdateForm(props: Props) {
  const { clients, products, proposal } = props;
  const {
    register,
    handleSubmit,
    control,
    appendScenario,
    removeScenario,
    scenarios,
    getValues,
    setValue,
  } = useClientProposalUpdateForm({
    defaultValues: {
      ...proposal,
      valid_at: proposal.valid_at
        .toISOString()
        .split("T")[0] as unknown as Date, // Formata a data aqui
    },
  });

  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="client_id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cliente
              </label>
              <select
                id="client_id"
                className="block w-full rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("client_id")}
              >
                <option>Selecione um cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.corporate_name} - {c.document.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="valid_at"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Valido até
              </label>
              <input
                type="date"
                id="valid_at"
                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("valid_at")}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="type"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Fase da Proposta
              </label>
              <select
                id="type"
                className="block w-full rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("phase")}
              >
                <option>Selecione um tipo</option>
                {Object.entries(clientConstants.proposalPhase).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="probability"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Probabilidade (%)
              </label>
              <input
                type="number"
                id="probability"
                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Digite a probabilidade"
                {...register("probability")}
              />
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Descrição
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                  {...register("description")}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Escreva um pouco sobre o cliente.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Cenários
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Insira os cenários possíveis.
          </p>

          <div className="flex flex-col space-y-4 mt-4">
            {scenarios.map((scenario, scenarioIndex) => (
              <>
                <Scenario
                  key={scenario.id}
                  id={scenario.id}
                  proposal={proposal}
                  control={control}
                  register={register}
                  scenarioIndex={scenarioIndex}
                  removeScenario={removeScenario}
                  products={products}
                  getValues={getValues}
                  setValue={setValue}
                />
              </>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              appendScenario({
                currency: Currency["BRL"],
                discount_value: 0,
                grand_total: 0,
                line_items: [],
                product_total: 0,
                subtotal_with_discount: 0,
                name: "",
                id: nanoid(),
              })
            }
            className={cn(
              "mt-4 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2",
              scenarios.length > 0 && "mt-12"
            )}
          >
            Adicionar Cenário
          </button>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Documentos e Assinaturas
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Uma lista de todos os documentos disponíveis.
          </p>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                {proposal.documents.map((document) => (
                  <li
                    key={document.id}
                    className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        aria-hidden="true"
                        className="size-5 shrink-0 text-gray-400"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          {document.name}
                        </span>
                        <span className="shrink-0 text-gray-400">
                          {(document.size / 1024).toFixed(2)}kb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Excluir
                      </a>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Assinatura
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Endereços
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Insira os endereços de cobrança e frete.
          </p>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            Endereço de Faturamento
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                País
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="country"
                  autoComplete="country"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("billing_address.country")}
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="street"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Rua
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="street"
                  autoComplete="street"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("billing_address.street")}
                />
              </div>
            </div>
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cidade
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("billing_address.city")}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="state"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Estado
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="state"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("billing_address.state")}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="postal_code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP / Código Postal
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="postal_code"
                  autoComplete="postal_code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("billing_address.postal_code")}
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            Endereço de Entrega
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                País
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="country"
                  autoComplete="country"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("delivery_address.country")}
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="street"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Rua
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="street"
                  autoComplete="street"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("delivery_address.street")}
                />
              </div>
            </div>
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cidade
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("delivery_address.city")}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="state"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Estado
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="state"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("delivery_address.state")}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="postal_code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP / Código Postal
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="postal_code"
                  autoComplete="postal_code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("delivery_address.postal_code")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
          Salvar
        </Button>
      </div>
    </form>
  );
}

interface Scenario {
  control: Control<ClientProposalSchema>;
  register: UseFormRegister<ClientProposalSchema>;
  scenarioIndex: number;
  products: IProduct[];
  removeScenario: UseFieldArrayRemove;
  setValue: UseFormSetValue<ClientProposalSchema>;
  getValues: UseFormGetValues<ClientProposalSchema>;
  id: string;
  proposal: IProposal;
}

function Scenario({
  control,
  register,
  scenarioIndex,
  removeScenario,
  products,
  setValue,
  getValues,
  id,
  proposal,
}: Scenario) {
  const {
    fields: lineItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `scenarios.${scenarioIndex}.line_items`,
  });

  const lineItemsWatched = useWatch({
    control,
    name: `scenarios.${scenarioIndex}.line_items`,
  });

  const freightValue = useWatch({
    control,
    name: `scenarios.${scenarioIndex}.freight.value`,
  });

  useEffect(() => {
    if (!lineItemsWatched) return;

    const currentTotals = lineItemsWatched.reduce(
      (totals, item, index) => {
        const lineTotal =
          item.unit_price * item.quantity -
          item.unit_price * item.quantity * (item.discount / 100);

        totals.productTotal += item.unit_price * item.quantity;
        totals.discountValue +=
          item.unit_price * item.quantity * (item.discount / 100);
        totals.lineTotals.push(lineTotal);

        // Atualize o total da linha no formulário, se necessário
        const currentLineTotal = getValues(
          `scenarios.${scenarioIndex}.line_items.${index}.total_price`
        );

        if (currentLineTotal !== lineTotal) {
          setValue(
            `scenarios.${scenarioIndex}.line_items.${index}.total_price`,
            lineTotal
          );
        }

        return totals;
      },
      { productTotal: 0, discountValue: 0, lineTotals: [] as number[] }
    );

    const newSubtotalWithDiscount =
      currentTotals.productTotal - currentTotals.discountValue;
    const newGrandTotal = newSubtotalWithDiscount + (+freightValue || 0);

    // Atualizar product_total se necessário
    const currentProductTotal = getValues(
      `scenarios.${scenarioIndex}.product_total`
    );
    if (currentProductTotal !== currentTotals.productTotal) {
      setValue(
        `scenarios.${scenarioIndex}.product_total`,
        currentTotals.productTotal
      );
    }

    // Atualizar discount_value se necessário
    const currentDiscountValue = getValues(
      `scenarios.${scenarioIndex}.discount_value`
    );
    if (currentDiscountValue !== currentTotals.discountValue) {
      setValue(
        `scenarios.${scenarioIndex}.discount_value`,
        currentTotals.discountValue
      );
    }

    // Atualizar subtotal_with_discount se necessário
    const currentSubtotalWithDiscount = getValues(
      `scenarios.${scenarioIndex}.subtotal_with_discount`
    );
    if (newSubtotalWithDiscount !== currentSubtotalWithDiscount) {
      setValue(
        `scenarios.${scenarioIndex}.subtotal_with_discount`,
        newSubtotalWithDiscount
      );
    }

    // Atualizar grand_total se necessário
    const currentGrandTotal = getValues(
      `scenarios.${scenarioIndex}.grand_total`
    );
    if (newGrandTotal !== currentGrandTotal) {
      setValue(`scenarios.${scenarioIndex}.grand_total`, newGrandTotal);
    }
  }, [lineItemsWatched, freightValue, setValue, getValues, scenarioIndex]);

  const handleCreateDocument = async (input: {
    scenario_id: string;
    proposal: IProposal;
  }) => {
    try {
      await createOneProposalDocument(input);
      toast({
        title: "Sucesso",
        description: "Documento Gerado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Erro ao gerar o documento!",
        variant: "error",
      });
    }
  };
  return (
    <Disclosure>
      <DisclosureButton className="group flex w-full items-center justify-between flex-wrap sm:flex-nowrap">
        <span className="text-sm font-medium text-gray-900 group-data-[hover]:text-gray-600 w-full sm:w-auto text-start">
          {scenarioIndex + 1}º Cenário
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex sm:divide-x-2 divide-gray-900/10 flex-wrap sm:flex-nowrap">
            <button
              className="text-sm text-gray-700 hover:text-gray-500 hover:underline w-full sm:w-auto sm:ml-2 sm:pl-2 text-start"
              onClick={(event) => {
                event.stopPropagation();
                removeScenario(scenarioIndex);
              }}
            >
              Remover Cenário
            </button>
            <button
              type="button"
              className="text-sm text-gray-700 hover:text-gray-500 hover:underline w-full sm:w-auto sm:ml-2 sm:pl-2 text-start"
              onClick={async (event) => {
                event.stopPropagation();
                await handleCreateDocument({ scenario_id: id, proposal });
              }}
            >
              Gerar Documento
            </button>
          </div>
          <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180 w-full sm:w-auto" />
        </div>
      </DisclosureButton>
      <div className="border-b border-gray-900/10"></div>
      <DisclosurePanel className="mt-2 text-sm text-gray-600">
        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Informações Gerais
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Insira os dados gerais desse cenário.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nome do cenário
              </label>
              <input
                type="text"
                id="name"
                autoComplete="name"
                className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Nome do cenário"
                {...register(`scenarios.${scenarioIndex}.name`)}
              />
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="currency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Moeda
              </label>
              <select
                id="currency"
                className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register(`scenarios.${scenarioIndex}.currency`)}
              >
                {Object.entries(clientConstants.proposalCurrency).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Descrição
              </label>
              <textarea
                id="description"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={""}
                {...register(`scenarios.${scenarioIndex}.description`)}
              />
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Escreva um pouco sobre esse cenário.
              </p>
            </div>
          </div>

          <h2 className="text-base font-semibold leading-7 text-gray-900 mt-8">
            Produtos
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Insira os produtos desse cenário.
          </p>
          <div className="mt-4">
            <div className="col-span-full space-y-4">
              {lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 lg:flex lg:items-end lg:justify-between lg:gap-4 mb-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end flex-grow">
                    {/* Produto */}
                    <div className="col-span-1 lg:col-span-2">
                      {index === 0 && (
                        <label
                          htmlFor="product_id"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Produto
                        </label>
                      )}
                      <select
                        id="product_id"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register(
                          `scenarios.${scenarioIndex}.line_items.${index}.product_id`
                        )}
                      >
                        {products.map((p: any) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantidade */}
                    <div>
                      {index === 0 && (
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Quantidade
                        </label>
                      )}
                      <input
                        type="number"
                        id="quantity"
                        className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Quantidade"
                        {...register(
                          `scenarios.${scenarioIndex}.line_items.${index}.quantity`
                        )}
                      />
                    </div>

                    {/* Preço Unitário */}
                    <div>
                      {index === 0 && (
                        <label
                          htmlFor="unit_price"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Preço Unitário
                        </label>
                      )}
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          type="text"
                          id="unit_price"
                          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          {...register(
                            `scenarios.${scenarioIndex}.line_items.${index}.unit_price`
                          )}
                        />
                      </div>
                    </div>

                    {/* Desconto */}
                    <div>
                      {index === 0 && (
                        <label
                          htmlFor="discount"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Desconto
                        </label>
                      )}
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">%</span>
                        </div>
                        <input
                          type="text"
                          id="discount"
                          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          {...register(
                            `scenarios.${scenarioIndex}.line_items.${index}.discount`
                          )}
                        />
                      </div>
                    </div>

                    {/* Preço Total */}
                    <div>
                      {index === 0 && (
                        <label
                          htmlFor="total_price"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Preço Total
                        </label>
                      )}
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          type="text"
                          id="total_price"
                          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          disabled
                          {...register(
                            `scenarios.${scenarioIndex}.line_items.${index}.total_price`
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botão Remover */}
                  <div className="mt-4 lg:mt-0">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit pr-2"
                    >
                      <XMarkIcon width={16} height={16} />
                      Remover linha
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                append({
                  id: nanoid(),
                  product_id: "",
                  quantity: 0,
                  unit_price: 0,
                  discount: 0,
                  total_price: 0,
                })
              }
              className={cn(
                "border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2",
                lineItemsWatched.length > 0 && "mt-4"
              )}
            >
              Adicionar Produto
            </button>
          </div>

          <h2 className="text-base font-semibold leading-7 text-gray-900 mt-8">
            Frete
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Insira as informações sobre o frete.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tipo
              </label>
              <select
                id="currency"
                className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register(`scenarios.${scenarioIndex}.freight.type`)}
              >
                {Object.entries(clientConstants.proposalFreightType).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Preço do Frete
              </label>
              <div className="relative rounded-md shadow-sm w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="text"
                  id="value"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="value-currency"
                  {...register(`scenarios.${scenarioIndex}.freight.value`)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    BRL
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-base font-semibold leading-7 text-gray-900 mt-8">
            Valores finais
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Confira os valores finais do seu cenário.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Total
              </label>
              <div className="relative rounded-md shadow-sm w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="text"
                  id="value"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="value-currency"
                  {...register(`scenarios.${scenarioIndex}.product_total`)}
                  disabled={true}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    BRL
                  </span>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Desconto
              </label>
              <div className="relative rounded-md shadow-sm w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="text"
                  id="value"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="value-currency"
                  {...register(`scenarios.${scenarioIndex}.discount_value`)}
                  disabled={true}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    BRL
                  </span>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                SubTotal (Total - Desconto)
              </label>
              <div className="relative rounded-md shadow-sm w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="text"
                  id="value"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="value-currency"
                  {...register(
                    `scenarios.${scenarioIndex}.subtotal_with_discount`
                  )}
                  disabled={true}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    BRL
                  </span>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Total Geral
              </label>
              <div className="relative rounded-md shadow-sm w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="text"
                  id="value"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="value-currency"
                  {...register(`scenarios.${scenarioIndex}.grand_total`)}
                  disabled={true}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    BRL
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-base font-semibold leading-7 text-gray-900 mt-8">
            Ações
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Confira abaixo as ações para esse cenário.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
              onClick={() => removeScenario(scenarioIndex)}
            >
              Remover {scenarioIndex + 1}º Cenário
            </button>
            <button
              type="button"
              onClick={async () => {
                await handleCreateDocument({ scenario_id: id, proposal });
              }}
              className="border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
            >
              Gerar Documento
            </button>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
