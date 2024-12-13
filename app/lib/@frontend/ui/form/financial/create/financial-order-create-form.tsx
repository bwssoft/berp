"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useFinancialOrderCreateForm } from "./use-financial-order-create-form";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export function FinancialOrderCreateForm() {
  const { handleSubmit } = useFinancialOrderCreateForm();
  return (
    <form action={() => handleSubmit()}>
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
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                <input />
              </div>
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
    </form>
  );
}
