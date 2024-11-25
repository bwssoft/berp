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
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhoneIcon,
  XCircleIcon,
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
import { useEffect, useMemo } from "react";
import {
  createOneProposalDocument,
  deleteOneProposalDocument,
  downloadOneProposalDocument,
  initializeSignatureProcess,
} from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { WhatsAppIcon, GmailIcon } from "@/app/lib/@frontend/ui/icon";
import Image from "next/image";
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
    current_client,
    handleDownloadOneProposalDocument,
  } = useClientProposalUpdateForm({
    clients,
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
                    {c.trade_name} - {c.document.value}
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
            Endereços
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
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

        <div className="border-b border-gray-900/10 pb-12">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Cenários
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Insira os cenários possíveis.
              </p>
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
                "border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
              )}
            >
              Adicionar Cenário
            </button>
          </div>

          <div className="flex flex-col space-y-4 mt-4">
            {scenarios.map((scenario, scenarioIndex) => (
              <>
                <Scenario
                  key={scenario.id}
                  id={scenario.id}
                  proposal={proposal}
                  scenarioIndex={scenarioIndex}
                  products={products}
                  removeScenario={removeScenario}
                  control={control}
                  register={register}
                  getValues={getValues}
                  setValue={setValue}
                />
                {scenarios.length > 1 ? (
                  <div className="border-b border-gray-900/10"></div>
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Processo de assinatura
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Uma lista dos cenários e dos processos de assinaturas.
          </p>
          <div className="flex flex-col space-y-4 mt-4">
            {proposal.scenarios.map((scenario, scenario_index) => (
              <SignatureProcess
                control={control}
                register={register}
                getValues={getValues}
                setValue={setValue}
                key={scenario.id + scenario_index}
                current_client={current_client}
                proposal={proposal}
                scenario={scenario}
                scenario_index={scenario_index}
                handleDownloadOneProposalDocument={
                  handleDownloadOneProposalDocument
                }
              />
            ))}
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

// ========================================================

interface Scenario {
  control: Control<ClientProposalSchema>;
  register: UseFormRegister<ClientProposalSchema>;
  removeScenario: UseFieldArrayRemove;
  setValue: UseFormSetValue<ClientProposalSchema>;
  getValues: UseFormGetValues<ClientProposalSchema>;
  id: string;
  scenarioIndex: number;
  products: IProduct[];
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
          </div>
          <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180 w-full sm:w-auto" />
        </div>
      </DisclosureButton>
      <DisclosurePanel className="mt-2 text-sm text-gray-600">
        <div className="rounded-xl bg-gray-50 p-2 ring-1 ring-inset ring-gray-900/10 lg:-p-4 lg:mt-4 lg:rounded-2xl lg:p-4">
          <h2 className="text-sm font-semibold leading-7 text-gray-900">
            Informações Gerais
          </h2>
          <p className="mt-1 text-xs leading-6 text-gray-600">
            Insira os dados gerais desse cenário.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-xs  font-medium leading-6 text-gray-900"
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
                className="block text-xs  font-medium leading-6 text-gray-900"
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
                className="block text-xs  font-medium leading-6 text-gray-900"
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
              <p className="mt-3 text-xs leading-6 text-gray-600">
                Escreva um pouco sobre esse cenário.
              </p>
            </div>
          </div>

          <h2 className="text-sm font-semibold leading-7 text-gray-900 mt-8">
            Produtos
          </h2>
          <p className="mt-1 text-xs leading-6 text-gray-600">
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
                          className="block text-xs font-medium leading-6 text-gray-900"
                        >
                          Produto
                        </label>
                      )}
                      <select
                        id="product_id"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
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
                          className="block text-xs font-medium leading-6 text-gray-900"
                        >
                          Quantidade
                        </label>
                      )}
                      <input
                        type="number"
                        id="quantity"
                        className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
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
                          className="block text-xs font-medium leading-6 text-gray-900"
                        >
                          Preço Unitário
                        </label>
                      )}
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-xs">R$</span>
                        </div>
                        <input
                          type="text"
                          id="unit_price"
                          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
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
                          className="block text-xs font-medium leading-6 text-gray-900"
                        >
                          Desconto
                        </label>
                      )}
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-xs">%</span>
                        </div>
                        <input
                          type="text"
                          id="discount"
                          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
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
                          className="block text-xs font-medium leading-6 text-gray-900"
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

          <h2 className="text-sm font-semibold leading-7 text-gray-900 mt-8">
            Frete
          </h2>
          <p className="mt-1 text-xs leading-6 text-gray-600">
            Insira as informações sobre o frete.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-xs font-medium leading-6 text-gray-900"
              >
                Tipo
              </label>
              <select
                id="currency"
                className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
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
                className="block text-xs font-medium leading-6 text-gray-900"
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

          <h2 className="text-sm font-semibold leading-7 text-gray-900 mt-8">
            Valores finais
          </h2>
          <p className="mt-1 text-xs leading-6 text-gray-600">
            Confira os valores finais do seu cenário.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-xs font-medium leading-6 text-gray-900"
              >
                Total
              </label>
              <div className="relative rounded-md shadow-sm w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-xs">R$</span>
                </div>
                <input
                  type="text"
                  id="value"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="value-currency"
                  {...register(`scenarios.${scenarioIndex}.product_total`)}
                  disabled={true}
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
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-xs font-medium leading-6 text-gray-900"
              >
                Desconto
              </label>
              <div className="relative rounded-md shadow-sm w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-xs">R$</span>
                </div>
                <input
                  type="text"
                  id="value"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="value-currency"
                  {...register(`scenarios.${scenarioIndex}.discount_value`)}
                  disabled={true}
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
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-xs font-medium leading-6 text-gray-900"
              >
                SubTotal (Total - Desconto)
              </label>
              <div className="relative rounded-md shadow-sm w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-xs">R$</span>
                </div>
                <input
                  type="text"
                  id="value"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="value-currency"
                  {...register(
                    `scenarios.${scenarioIndex}.subtotal_with_discount`
                  )}
                  disabled={true}
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
            <div className="sm:col-span-2">
              <label
                htmlFor="currency"
                className="block text-xs font-medium leading-6 text-gray-900"
              >
                Total Geral
              </label>
              <div className="relative rounded-md shadow-sm w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-xs">R$</span>
                </div>
                <input
                  type="text"
                  id="value"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="value-currency"
                  {...register(`scenarios.${scenarioIndex}.grand_total`)}
                  disabled={true}
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
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

// ===========================================================
interface SignatureProcess {
  control: Control<ClientProposalSchema>;
  register: UseFormRegister<ClientProposalSchema>;
  setValue: UseFormSetValue<ClientProposalSchema>;
  getValues: UseFormGetValues<ClientProposalSchema>;
  proposal: IProposal;
  scenario: IProposal["scenarios"][number];
  scenario_index: number;
  current_client?: IClient;
  handleDownloadOneProposalDocument: (props: {
    document_key: string;
    proposal: IProposal;
  }) => Promise<void>;
}
function SignatureProcess(props: SignatureProcess) {
  const {
    proposal,
    scenario,
    current_client,
    handleDownloadOneProposalDocument,
    scenario_index,
  } = props;
  const documents = proposal.documents.filter(
    (doc) => doc.scenario_id === scenario.id
  );
  const signature_process = proposal?.signature_process?.find(
    (el) => el.scenario_id === scenario.id
  );

  const handleCreateDocument = async (input: {
    scenario: IProposal["scenarios"][number];
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
          {scenario_index + 1}º Cenário
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180 w-full sm:w-auto" />
        </div>
      </DisclosureButton>
      <div className="border-b border-gray-900/10"></div>

      <DisclosurePanel>
        <div className="rounded-xl bg-gray-50 p-2 ring-1 ring-inset ring-gray-900/10 lg:-p-4 lg:mt-4 lg:rounded-2xl lg:p-4">
          {signature_process ? (
            <div>
              <h2 className="text-sm font-semibold leading-7 text-gray-900">
                Lista de contatos do cliente
              </h2>
              <p className="text-sm leading-6 text-gray-600">
                Uma lista de todos os contatos disponíveis para assinatura.
              </p>
              <label
                htmlFor="currency"
                className="mt-2 block text-xs font-medium leading-6 text-gray-900"
              >
                Acompanhe o progresso de cada contato
              </label>
              <ul role="list" className="flex flex-col mt-2 space-y-2">
                {current_client?.contacts.map((contact) => {
                  const contact_in_signature_process =
                    signature_process.contact.find((c) => c.id === contact.id);

                  return (
                    <li
                      key={contact.id}
                      className="col-span-1 border border-gray-200 rounded-lg bg-white flex"
                    >
                      <div className="flex w-full items-center justify-between space-x-6 py-3 px-6">
                        <div className="relative flex gap-2 flex-none items-center justify-center bg-white">
                          {contact_in_signature_process?.signed && (
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="size-5 text-green-600"
                              title="Esse contato aceitou a proposta."
                            />
                          )}
                          {!contact_in_signature_process?.signed && (
                            <XCircleIcon
                              aria-hidden="true"
                              className="size-5 text-red-600"
                              title="Esse contato negou a proposta."
                            />
                          )}
                          {contact_in_signature_process?.seen && (
                            <EyeIcon
                              aria-hidden="true"
                              className="size-5 text-gray-600"
                              title="Esse contato viu o processo."
                            />
                          )}
                          {!contact_in_signature_process?.seen && (
                            <EyeSlashIcon
                              aria-hidden="true"
                              className="size-5 text-gray-600"
                              title="Esse contato ainda não viu a proposta."
                            />
                          )}
                          {contact_in_signature_process?.sent && (
                            <PaperAirplaneIcon
                              aria-hidden="true"
                              className="size-5 text-blue-600"
                              title="A proposta foi enviada para o contato."
                            />
                          )}
                          {contact_in_signature_process?.requested && (
                            <ClockIcon
                              aria-hidden="true"
                              className="size-5 text-indigo-600"
                              title="Esse contato foi requisitado para assinar a proposta."
                            />
                          )}
                          {!contact_in_signature_process?.requested && (
                            <ExclamationCircleIcon
                              aria-hidden="true"
                              className="size-5 text-yellow-600"
                              title="Esse contato ainda não teve seu processo de assinatura iniciado."
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="truncate text-xs font-medium text-gray-900">
                              {contact.name}
                            </h3>
                            {Object.values(contact.labels).map((label) => (
                              <span
                                key={label}
                                className="inline-flex shrink-0 items-center rounded-full bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                          {contact?.email ? (
                            <p className="mt-1 truncate text-xs text-gray-500">
                              {Object.values(contact.email)
                                .map((p) => p)
                                .join("; ")}
                            </p>
                          ) : (
                            <></>
                          )}
                          {contact?.phone ? (
                            <p className="mt-1 truncate text-xs text-gray-500">
                              {Object.values(contact.phone)
                                .map((p) => p)
                                .join("; ")}
                            </p>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            Requisitar Assinatura
                          </button>
                          {/* <div className="flex flex-col w-fit items-start">
                          <p className="text-sm leading-6 text-gray-600 text-nowrap">
                            Click e envie o documento:
                          </p>
                          <div className="flex gap-4 justify-start">
                            <button
                              type="button"
                              className="w-fit inline-flex items-center px-2 py-1 gap-2 rounded bg-white text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              title="Enviar documento para assinatura via whatsapp"
                            >
                              <Image
                                src={WhatsAppIcon}
                                alt="WhatsApp Icon"
                                width={32}
                                height={32}
                                className="hover:scale-[0.9] hover:cursor-pointer -ml-0.5 size-5"
                              />
                              Whatsapp
                            </button>
                            <button
                              type="button"
                              className="w-fit inline-flex items-center px-2 py-1 gap-2 rounded bg-white text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              title="Enviar documento para assinatura via email"
                            >
                              <Image
                                src={GmailIcon}
                                alt="Gmail Icon"
                                width={32}
                                height={32}
                                className="hover:scale-[0.9] hover:cursor-pointer -ml-0.5 size-5"
                              />
                              Email
                            </button>
                          </div>
                        </div> */}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="rounded-md bg-gray-100 border border-gray-200 px-6 py-3">
              <div className="flex">
                <div className="shrink-0">
                  <InformationCircleIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                </div>
                <div className="ml-6 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-gray-700">
                    Esse cenário ainda não iniciou o processo de assinutura.
                  </p>
                  <p className="mt-3 text-sm md:ml-6 md:mt-0">
                    <button
                      type="button"
                      onClick={() =>
                        initializeSignatureProcess({
                          contact_id:
                            current_client?.contacts.map((c) => c.id) ?? [],
                          document_id: documents.map((d) => d.id),
                          proposal_id: proposal.id,
                          scenario_id: scenario.id,
                        })
                      }
                      className="whitespace-nowrap font-medium text-gray-700 hover:text-gray-600"
                    >
                      Iniciar
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
          {documents.length > 0 ? (
            <div className="pt-4">
              <h2 className="text-sm font-semibold leading-7 text-gray-900">
                Lista de documentos do cenário
              </h2>
              <p className="text-sm leading-6 text-gray-600">
                Uma lista de todos os documentos desse cenário.
              </p>
              <ul
                role="list"
                className="mt-2 divide-y divide-gray-100 rounded-md border border-gray-200 bg-white"
              >
                {documents.map((document) => (
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
                      <button
                        type="button"
                        onClick={async () =>
                          await deleteOneProposalDocument({
                            document_key: document.key,
                            proposal,
                          })
                        }
                        className="text-sm text-gray-700 hover:text-gray-500 hover:underline w-full sm:w-auto sm:ml-2 sm:pl-2 text-start"
                      >
                        Excluir
                      </button>
                    </div>
                    <div className="ml-4 shrink-0">
                      <button
                        type="button"
                        onClick={async () =>
                          await handleDownloadOneProposalDocument({
                            document_key: document.key,
                            proposal,
                          })
                        }
                        className="text-sm text-gray-700 hover:text-gray-500 hover:underline w-full sm:w-auto sm:ml-2 sm:pl-2 text-start"
                      >
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
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
                    Esse cenário ainda não teve nenhum documento gerado.
                  </p>
                  <p className="mt-3 text-sm md:ml-6 md:mt-0">
                    <button
                      type="button"
                      className="whitespace-nowrap font-medium text-gray-700 hover:text-gray-600"
                      onClick={() =>
                        handleCreateDocument({ proposal, scenario })
                      }
                    >
                      Gerar
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
