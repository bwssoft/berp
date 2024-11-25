"use client";
import { Button } from "../../../button";
import {
  ClientProposalSchema,
  useClientProposalCreateForm,
} from "./use-client-proposal-create-form";
import { Currency, IClient, IProduct } from "@/app/lib/@backend/domain";
import { clientConstants } from "@/app/lib/constant";
import { cn } from "@/app/lib/util";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Control,
  useFieldArray,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormUnregister,
  useWatch,
} from "react-hook-form";
import { nanoid } from "nanoid";
import { useEffect } from "react";

interface Props {
  clients: IClient[];
  products: IProduct[];
}
export function ClientProposalCreateForm(props: Props) {
  const { clients, products } = props;
  const {
    register,
    handleSubmit,
    control,
    appendScenario,
    removeScenario,
    scenarios,
    setValue,
    unregister,
    getValues,
  } = useClientProposalCreateForm();

  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            {/* <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                autoComplete="name"
                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Insira o nome"
                {...register("name")}
              />
            </div> */}

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
            Cenários
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Insira os cenários possíveis.
          </p>

          <div className="flex flex-col space-y-4 mt-4">
            {scenarios.map((scenario, scenarioIndex) => (
              <Scenario
                key={scenario.id}
                control={control}
                register={register}
                scenarioIndex={scenarioIndex}
                removeScenario={removeScenario}
                products={products}
                setValue={setValue}
                getValues={getValues}
              />
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
            Endereços
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Endereço de Faturamento
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="col-span-3">
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
            <div className="col-span-3">
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
      <DisclosureButton className="group flex w-full items-center justify-between">
        <span className="text-sm font-medium text-gray-600 group-data-[hover]:text-gray-600">
          {scenarioIndex + 1}º Cenário
        </span>
        <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <div className="border-b border-gray-900/10"></div>
      <DisclosurePanel className="mt-2 text-sm text-gray-600">
        <div className="border-b border-gray-900/10 pb-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
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
            <div className="col-span-full">
              {lineItems.map((item, index) => {
                return (
                  <div key={item.id} className="flex space-x-4 mb-2 items-end">
                    <div className="w-1/2">
                      {index == 0 ? (
                        <label
                          htmlFor="name"
                          className="block w-full text-sm font-medium leading-6 text-gray-900"
                        >
                          Produto
                        </label>
                      ) : (
                        <></>
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
                    <div className="w-1/3">
                      {index == 0 ? (
                        <label
                          htmlFor="name"
                          className="block w-full text-sm font-medium leading-6 text-gray-900"
                        >
                          Quantidade
                        </label>
                      ) : (
                        <></>
                      )}
                      <input
                        type="number"
                        id="quantity"
                        autoComplete="quantity"
                        className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Quantidade"
                        {...register(
                          `scenarios.${scenarioIndex}.line_items.${index}.quantity`
                        )}
                      />
                    </div>
                    <div className="w-1/5">
                      {index == 0 ? (
                        <label
                          htmlFor="name"
                          className="block w-full text-sm font-medium leading-6 text-gray-900"
                        >
                          Preço Unitário
                        </label>
                      ) : (
                        <></>
                      )}
                      <div className="relative rounded-md shadow-sm w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          type="text"
                          {...register(
                            `scenarios.${scenarioIndex}.line_items.${index}.unit_price`
                          )}
                          id="value"
                          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          aria-describedby="value-currency"
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
                    <div className="w-1/5">
                      {index == 0 ? (
                        <label
                          htmlFor="name"
                          className="block w-full text-sm font-medium leading-6 text-gray-900"
                        >
                          Desconto
                        </label>
                      ) : (
                        <></>
                      )}
                      <div className="relative rounded-md shadow-sm w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">%</span>
                        </div>
                        <input
                          type="text"
                          {...register(
                            `scenarios.${scenarioIndex}.line_items.${index}.discount`
                          )}
                          id="value"
                          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          aria-describedby="value-currency"
                        />
                      </div>
                    </div>
                    <div className="w-1/5">
                      {index == 0 ? (
                        <label
                          htmlFor="name"
                          className="block w-full text-sm font-medium leading-6 text-gray-900"
                        >
                          Preço Total
                        </label>
                      ) : (
                        <></>
                      )}
                      <div className="relative rounded-md shadow-sm w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          type="text"
                          {...register(
                            `scenarios.${scenarioIndex}.line_items.${index}.total_price`
                          )}
                          id="value"
                          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          aria-describedby="value-currency"
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
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                    >
                      <XMarkIcon width={16} height={16} />
                    </Button>
                  </div>
                );
              })}
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
              className="border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
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

          <button
            type="button"
            onClick={() => {
              removeScenario(scenarioIndex);
            }}
            className="mt-4 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Remover {scenarioIndex + 1}º Cenário
          </button>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
