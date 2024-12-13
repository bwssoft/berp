"use client";
import { Button } from "../../../button";
import {
  ClientProposalSchema,
  useClientProposalUpdateForm,
} from "./use-client-proposal-update-form";
import {
  Currency,
  IClient,
  INegotiationType,
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
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  EllipsisVerticalIcon,
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
import { useEffect } from "react";
import {
  cancelBillingProcess,
  cancelSignatureProcess,
  createOneProposalDocument,
  deleteOneProposalDocument,
  initializeBillingProcess,
  initializeSignatureProcess,
} from "@/app/lib/@backend/action";
import { toast } from "@/app/lib/@frontend/hook";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { SaleProposalBillingProcessTable } from "../../../table/sale-proposal-billing-process";
interface Props {
  clients: IClient[];
  client: IClient;
  products: IProduct[];
  proposal: IProposal;
  negotiationType: INegotiationType[];
}
export function ClientProposalUpdateForm(props: Props) {
  const { clients, products, proposal, negotiationType, client } = props;
  const {
    register,
    handleSubmit,
    control,
    appendScenario,
    removeScenario,
    scenarios,
    getValues,
    setValue,
    currentClient,
    handleDownloadOneProposalDocument,
    handleChangeClient,
  } = useClientProposalUpdateForm({
    defaultValues: proposal,
    client,
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
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  const clientData = selectedOption.getAttribute("data-client");
                  const client = JSON.parse(clientData as string);
                  console.log(client);
                  handleChangeClient(client);
                }}
              >
                <option>Selecione um cliente</option>
                {clients.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                    data-client={JSON.stringify(c)}
                  >
                    {c.trade_name} - {c.document.value}
                  </option>
                ))}
              </select>
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
          <Disclosure>
            <DisclosureButton className="group flex w-full items-center justify-between flex-wrap sm:flex-nowrap">
              <div className="w-full text-start">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Endereços
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Insira os endereços de faturamento e de entrega.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180 w-full sm:w-auto" />
              </div>
            </DisclosureButton>
            <DisclosurePanel>
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
            </DisclosurePanel>
          </Disclosure>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <Disclosure>
            <DisclosureButton className="group flex w-full items-center justify-between flex-wrap sm:flex-nowrap">
              <div className="w-full text-start">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Cenários
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Insira os cenários possíveis.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180 w-full sm:w-auto" />
              </div>
            </DisclosureButton>
            <DisclosurePanel>
              <div className="flex flex-col space-y-4 mt-8">
                {scenarios.map((scenario, hookFormScenarioIndex) => (
                  <>
                    <Scenario
                      key={scenario.id}
                      scenario_id={scenario.id}
                      proposal={proposal}
                      hookFormScenarioIndex={hookFormScenarioIndex}
                      products={products}
                      negotiationType={negotiationType}
                      removeScenario={removeScenario}
                      control={control}
                      register={register}
                      getValues={getValues}
                      setValue={setValue}
                      handleDownloadOneProposalDocument={
                        handleDownloadOneProposalDocument
                      }
                      currentClient={currentClient}
                    />
                    {scenarios.length > 1 ? (
                      <div className="border-b border-gray-900/10"></div>
                    ) : (
                      <></>
                    )}
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
                  scenarios.length > 0 && "mt-8"
                )}
              >
                Adicionar Cenário
              </button>
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
      {/* 
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
      </div> */}
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
  hookFormScenarioIndex: number;

  products: IProduct[];
  negotiationType: INegotiationType[];
  proposal: IProposal;
  scenario_id: string;
  currentClient?: IClient;

  handleDownloadOneProposalDocument: (props: {
    document: NonNullable<IProposal["scenarios"][number]["document"]>[number];
  }) => Promise<void>;
}
function Scenario({
  //react-hook-form
  control,
  register,
  removeScenario,
  getValues,
  setValue,
  hookFormScenarioIndex,

  proposal,
  products,
  negotiationType,
  scenario_id,
  currentClient,

  handleDownloadOneProposalDocument,
}: Scenario) {
  const scenario = proposal.scenarios.find((sce) => sce.id === scenario_id);
  const documents = scenario?.document ?? [];
  const signature_process = scenario?.signature_process;
  const billing_process = scenario?.billing_process ?? [];
  const contacts = currentClient?.contacts ?? [];

  const {
    fields: lineItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `scenarios.${hookFormScenarioIndex}.line_items`,
  });

  const lineItemsWatched = useWatch({
    control,
    name: `scenarios.${hookFormScenarioIndex}.line_items`,
  });

  const freightValue = useWatch({
    control,
    name: `scenarios.${hookFormScenarioIndex}.freight.value`,
  });

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
          `scenarios.${hookFormScenarioIndex}.line_items.${index}.total_price`
        );

        if (currentLineTotal !== lineTotal) {
          setValue(
            `scenarios.${hookFormScenarioIndex}.line_items.${index}.total_price`,
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
      `scenarios.${hookFormScenarioIndex}.product_total`
    );
    if (currentProductTotal !== currentTotals.productTotal) {
      setValue(
        `scenarios.${hookFormScenarioIndex}.product_total`,
        currentTotals.productTotal
      );
    }

    // Atualizar discount_value se necessário
    const currentDiscountValue = getValues(
      `scenarios.${hookFormScenarioIndex}.discount_value`
    );
    if (currentDiscountValue !== currentTotals.discountValue) {
      setValue(
        `scenarios.${hookFormScenarioIndex}.discount_value`,
        currentTotals.discountValue
      );
    }

    // Atualizar subtotal_with_discount se necessário
    const currentSubtotalWithDiscount = getValues(
      `scenarios.${hookFormScenarioIndex}.subtotal_with_discount`
    );
    if (newSubtotalWithDiscount !== currentSubtotalWithDiscount) {
      setValue(
        `scenarios.${hookFormScenarioIndex}.subtotal_with_discount`,
        newSubtotalWithDiscount
      );
    }

    // Atualizar grand_total se necessário
    const currentGrandTotal = getValues(
      `scenarios.${hookFormScenarioIndex}.grand_total`
    );
    if (newGrandTotal !== currentGrandTotal) {
      setValue(`scenarios.${hookFormScenarioIndex}.grand_total`, newGrandTotal);
    }
  }, [
    lineItemsWatched,
    freightValue,
    setValue,
    getValues,
    hookFormScenarioIndex,
  ]);

  return (
    <Disclosure>
      <DisclosureButton className="group flex w-full items-center justify-between flex-wrap sm:flex-nowrap px-4">
        <span className="text-sm font-medium text-gray-900 group-data-[hover]:text-gray-600 w-full sm:w-auto text-start">
          {hookFormScenarioIndex + 1}º Cenário
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex sm:divide-x-2 divide-gray-900/10 flex-wrap sm:flex-nowrap">
            <button
              className="text-sm text-gray-700 hover:text-gray-500 hover:underline w-full sm:w-auto sm:ml-2 sm:pl-2 text-start"
              onClick={(event) => {
                event.stopPropagation();
                removeScenario(hookFormScenarioIndex);
              }}
            >
              Remover Cenário
            </button>
          </div>
          <ChevronDownIcon className="size-5 fill-gray-text-gray-600 group-data-[hover]:fill-gray-text-gray-600 group-data-[open]:rotate-180 w-full sm:w-auto" />
        </div>
      </DisclosureButton>
      <DisclosurePanel className="mt-2 text-sm text-gray-600">
        <div className="rounded-sm bg-gray-50 p-2 ring-1 ring-inset ring-gray-900/10 lg:px-4 lg:py-8">
          {/*INFORMAÇÕES GERAIS*/}
          <Disclosure>
            {({ open }) => (
              <>
                <DisclosureButton className="group w-full flex justify-between items-center">
                  <div className="w-full flex flex-col items-start">
                    <h2 className="text-sm font-semibold leading-7 text-gray-900">
                      Informações Gerais
                    </h2>
                    <p className="text-xs leading-6 text-gray-600">
                      Insira os dados gerais desse cenário.
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={cn(
                      "size-5 fill-gray-text-gray-600 w-full sm:w-auto",
                      open && "rotate-180"
                    )}
                  />
                </DisclosureButton>
                <div className="border-b border-gray-900/10"></div>
                <DisclosurePanel>
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
                        {...register(`scenarios.${hookFormScenarioIndex}.name`)}
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
                        {...register(
                          `scenarios.${hookFormScenarioIndex}.currency`
                        )}
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
                        {...register(
                          `scenarios.${hookFormScenarioIndex}.description`
                        )}
                      />
                      <p className="mt-3 text-xs leading-6 text-gray-600">
                        Escreva um pouco sobre esse cenário.
                      </p>
                    </div>
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>

          {/*PRODUTOS*/}
          <Disclosure>
            {({ open }) => (
              <>
                <DisclosureButton className="w-full flex justify-between items-center mt-8">
                  <div className="w-full flex flex-col items-start">
                    <h2 className="text-sm font-semibold leading-7 text-gray-900">
                      Produtos
                    </h2>
                    <p className="text-xs leading-6 text-gray-600">
                      Insira os produtos desse cenário.
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={cn(
                      "size-5 fill-gray-text-gray-600 w-full sm:w-auto",
                      open && "rotate-180"
                    )}
                  />
                </DisclosureButton>
                <div className="border-b border-gray-900/10"></div>
                <DisclosurePanel>
                  <div className="mt-4">
                    <div className="col-span-full space-y-4">
                      {lineItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 lg:flex lg:items-end lg:justify-between lg:gap-4 mb-2"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-end flex-grow">
                            {/* Tipo de Negociação */}
                            <div className="col-span-full lg:col-span-1">
                              {index === 0 && (
                                <label
                                  htmlFor="negotiation_type"
                                  className="block text-xs font-medium leading-6 text-gray-900"
                                >
                                  Tipo de negociação
                                </label>
                              )}
                              <select
                                id="negotiation_type"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
                                {...register(
                                  `scenarios.${hookFormScenarioIndex}.line_items.${index}.negotiation_type_id`
                                )}
                              >
                                {negotiationType.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Produto */}
                            <div className="col-span-full lg:col-span-2">
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
                                  `scenarios.${hookFormScenarioIndex}.line_items.${index}.product_id`
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
                            <div className="col-span-full lg:col-span-1">
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
                                  `scenarios.${hookFormScenarioIndex}.line_items.${index}.quantity`
                                )}
                              />
                            </div>

                            {/* Preço Unitário */}
                            <div className="col-span-full lg:col-span-1">
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
                                  <span className="text-gray-500 sm:text-xs">
                                    R$
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  id="unit_price"
                                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
                                  placeholder="0.00"
                                  {...register(
                                    `scenarios.${hookFormScenarioIndex}.line_items.${index}.unit_price`
                                  )}
                                />
                              </div>
                            </div>

                            {/* Desconto */}
                            <div className="col-span-full lg:col-span-1">
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
                                  <span className="text-gray-500 sm:text-xs">
                                    %
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  id="discount"
                                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
                                  placeholder="0.00"
                                  {...register(
                                    `scenarios.${hookFormScenarioIndex}.line_items.${index}.discount`
                                  )}
                                />
                              </div>
                            </div>

                            {/* Preço Total */}
                            <div className="col-span-full lg:col-span-1">
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
                                  <span className="text-gray-500 sm:text-sm">
                                    R$
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  id="total_price"
                                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="0.00"
                                  disabled
                                  {...register(
                                    `scenarios.${hookFormScenarioIndex}.line_items.${index}.total_price`
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
                              className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                            >
                              <XMarkIcon width={16} height={16} />
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
                          negotiation_type_id: "",
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
                </DisclosurePanel>
              </>
            )}
          </Disclosure>

          {/*FRETE*/}
          <Disclosure>
            {({ open }) => (
              <>
                <DisclosureButton className="group w-full flex justify-between items-center mt-8">
                  <div className="w-full flex flex-col items-start">
                    <h2 className="text-sm font-semibold leading-7 text-gray-900">
                      Frete
                    </h2>
                    <p className="text-xs leading-6 text-gray-600">
                      Insira as informações sobre o frete.
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={cn(
                      "size-5 fill-gray-text-gray-600 w-full sm:w-auto",
                      open && "rotate-180"
                    )}
                  />
                </DisclosureButton>
                <div className="border-b border-gray-900/10"></div>
                <DisclosurePanel>
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
                        {...register(
                          `scenarios.${hookFormScenarioIndex}.freight.type`
                        )}
                      >
                        {Object.entries(
                          clientConstants.proposalFreightType
                        ).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
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
                          {...register(
                            `scenarios.${hookFormScenarioIndex}.freight.value`
                          )}
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
                </DisclosurePanel>
              </>
            )}
          </Disclosure>

          {/*VALORES FINAIS*/}
          <Disclosure>
            {({ open }) => (
              <>
                <DisclosureButton className="group w-full flex justify-between items-center mt-8">
                  <div className="w-full flex flex-col items-start">
                    <h2 className="text-sm font-semibold leading-7 text-gray-900">
                      Valores finais
                    </h2>
                    <p className="text-xs leading-6 text-gray-600">
                      Confira os valores finais do seu cenário.
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={cn(
                      "size-5 fill-gray-text-gray-600 w-full sm:w-auto",
                      open && "rotate-180"
                    )}
                  />
                </DisclosureButton>
                <div className="border-b border-gray-900/10"></div>
                <DisclosurePanel>
                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-8">
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
                          {...register(
                            `scenarios.${hookFormScenarioIndex}.product_total`
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
                          {...register(
                            `scenarios.${hookFormScenarioIndex}.discount_value`
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
                            `scenarios.${hookFormScenarioIndex}.subtotal_with_discount`
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
                          {...register(
                            `scenarios.${hookFormScenarioIndex}.grand_total`
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
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>

          {/*DOCUMENTOS*/}
          <Disclosure>
            {({ open }) => (
              <>
                <DisclosureButton className="group w-full flex justify-between items-center mt-8">
                  <div className="w-full flex flex-col items-start">
                    <h2 className="text-sm font-semibold leading-7 text-gray-900">
                      Documentos
                    </h2>
                    <p className="text-xs leading-6 text-gray-600">
                      Uma lista de todos os documentos desse cenário
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={cn(
                      "size-5 fill-gray-text-gray-600 w-full sm:w-auto",
                      open && "rotate-180"
                    )}
                  />
                </DisclosureButton>
                <div className="border-b border-gray-900/10"></div>
                <DisclosurePanel>
                  {documents?.length ? (
                    <ul
                      role="list"
                      className="mt-4 divide-y divide-gray-100 rounded-md border border-gray-200 bg-white"
                    >
                      {documents.map((document) => (
                        <li
                          key={document.id}
                          className="flex items-center justify-between py-4 px-5 text-sm/6"
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
                                  document,
                                  proposal_id: proposal.id,
                                  scenario_id,
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
                                  document,
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
                                handleCreateDocument({
                                  proposal,
                                  scenario: scenario!,
                                })
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
                </DisclosurePanel>
              </>
            )}
          </Disclosure>

          {/*PROCESSO DE ASSINATURA*/}
          <Disclosure>
            {({ open }) => (
              <>
                <DisclosureButton className="group w-full flex justify-between items-center mt-8">
                  <div className="w-full flex flex-col items-start">
                    <h2 className="text-sm font-semibold leading-7 text-gray-900">
                      Processo de assinatura
                    </h2>
                    <p className="text-xs leading-6 text-gray-600">
                      Acompanhe o processo de assinatura dos documentos.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    {signature_process ? (
                      <button
                        type="button"
                        className="text-sm text-gray-700 hover:text-gray-500 hover:underline w-full sm:w-auto sm:ml-2 sm:pl-2 text-start text-nowrap"
                        onClick={async (event) => {
                          event.stopPropagation();
                          await cancelSignatureProcess({
                            proposal_id: proposal.id,
                            scenario_id: scenario_id,
                          });
                        }}
                      >
                        Cancelar o processo
                      </button>
                    ) : (
                      <></>
                    )}
                    <ChevronDownIcon
                      className={cn(
                        "size-5 fill-gray-text-gray-600 w-full sm:w-auto",
                        open && "rotate-180"
                      )}
                    />
                  </div>
                </DisclosureButton>
                <div className="border-b border-gray-900/10"></div>
                <DisclosurePanel>
                  {signature_process ? (
                    <div className="mt-4 flex gap-8 rounded-md border border-gray-200 bg-white px-5 py-4">
                      <div className="w-full">
                        <h2 className="text-sm font-semibold leading-7 text-gray-900">
                          Lista de contatos
                        </h2>
                        <p className="text-xs leading-6 text-gray-600">
                          Segue abaixo uma lista com todos os contatos desse
                          cliente.
                        </p>
                        <ul role="list" className="divide-y divide-gray-100">
                          {contacts.map((person) => (
                            <li
                              key={person.id}
                              className="flex justify-between gap-x-6 py-5"
                            >
                              <div className="flex gap-x-4 w-full">
                                <img
                                  alt=""
                                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                  className="size-12 flex-none rounded-full bg-gray-50"
                                />
                                <div className="min-w-0 flex-auto">
                                  <div className="flex items-center gap-x-3">
                                    <p className="text-sm/6 font-semibold text-gray-900">
                                      {person.name}
                                    </p>
                                    <p className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                      {person.label}
                                    </p>
                                  </div>
                                  {person.email}
                                </div>
                                <div className="flex flex-none items-center gap-x-4">
                                  <Menu as="div" className="relative flex-none">
                                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                      <span className="sr-only">
                                        Open options
                                      </span>
                                      <EllipsisVerticalIcon
                                        aria-hidden="true"
                                        className="size-5"
                                      />
                                    </MenuButton>
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                      <MenuItem>
                                        <a
                                          href="#"
                                          className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                                        >
                                          Ver
                                        </a>
                                      </MenuItem>
                                      <MenuItem>
                                        <a
                                          href="#"
                                          className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                                        >
                                          Adicionar
                                        </a>
                                      </MenuItem>
                                      <MenuItem>
                                        <a
                                          href="#"
                                          className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                                        >
                                          Remover
                                        </a>
                                      </MenuItem>
                                    </MenuItems>
                                  </Menu>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-l border-gray-900/10"></div>
                      <div>
                        <h2 className="text-sm font-semibold leading-7 text-gray-900">
                          Progresso
                        </h2>
                        <p className="text-xs leading-6 text-gray-600">
                          Acompanhe o progresso do processo.
                        </p>
                        <nav aria-label="Progress" className="mt-4">
                          <ol role="list" className="overflow-hidden">
                            {steps.map((step, stepIdx) => (
                              <li
                                key={step.name}
                                className={cn(
                                  stepIdx !== steps.length - 1 ? "pb-10" : "",
                                  "relative"
                                )}
                              >
                                {step.status === "complete" ? (
                                  <>
                                    {stepIdx !== steps.length - 1 ? (
                                      <div
                                        aria-hidden="true"
                                        className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-indigo-600"
                                      />
                                    ) : null}
                                    <a
                                      href={step.href}
                                      className="group relative flex items-start"
                                    >
                                      <span className="flex h-9 items-center">
                                        <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                                          <CheckIcon
                                            aria-hidden="true"
                                            className="size-5 text-white"
                                          />
                                        </span>
                                      </span>
                                      <span className="ml-4 flex min-w-0 flex-col">
                                        <span className="text-sm font-medium">
                                          {step.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          {step.description}
                                        </span>
                                      </span>
                                    </a>
                                  </>
                                ) : step.status === "current" ? (
                                  <>
                                    {stepIdx !== steps.length - 1 ? (
                                      <div
                                        aria-hidden="true"
                                        className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                                      />
                                    ) : null}
                                    <a
                                      href={step.href}
                                      aria-current="step"
                                      className="group relative flex items-start"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="flex h-9 items-center"
                                      >
                                        <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                                          <span className="size-2.5 rounded-full bg-indigo-600" />
                                        </span>
                                      </span>
                                      <span className="ml-4 flex min-w-0 flex-col">
                                        <span className="text-sm font-medium text-indigo-600">
                                          {step.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          {step.description}
                                        </span>
                                      </span>
                                    </a>
                                  </>
                                ) : (
                                  <>
                                    {stepIdx !== steps.length - 1 ? (
                                      <div
                                        aria-hidden="true"
                                        className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                                      />
                                    ) : null}
                                    <a
                                      href={step.href}
                                      className="group relative flex items-start"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="flex h-9 items-center"
                                      >
                                        <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                                          <span className="size-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                                        </span>
                                      </span>
                                      <span className="ml-4 flex min-w-0 flex-col">
                                        <span className="text-sm font-medium text-gray-500">
                                          {step.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          {step.description}
                                        </span>
                                      </span>
                                    </a>
                                  </>
                                )}
                              </li>
                            ))}
                          </ol>
                        </nav>
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
                            Esse cenário ainda não iniciou o processo de
                            assinatura.
                          </p>
                          <p className="mt-3 text-sm md:ml-6 md:mt-0">
                            <button
                              type="button"
                              onClick={() =>
                                initializeSignatureProcess({
                                  proposal_id: proposal.id,
                                  scenario_id: scenario_id,
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
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

const steps = [
  {
    name: "Processo Iniciado",
    description: "O processo de assinatura foi iniciado.",
    href: "#",
    status: "complete",
  },
  {
    name: "Requisitar Contato",
    description: "Selecione os contatos que devem assinar os documentos.",
    href: "#",
    status: "current",
  },
  {
    name: "Visualização",
    description: "Todos os contatos requeridos visualizaram os documentos.",
    href: "#",
    status: "upcoming",
  },
  {
    name: "Finalizado",
    description: "Todos os contatos requeridos assinaram os documentos.",
    href: "#",
    status: "upcoming",
  },
];
