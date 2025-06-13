"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { IAccount, IContact } from "@/app/lib/@backend/domain";
import { useSearchContactHistoricalAccount } from "./use-create-contact.historical.form";
import {
  Button,
  Checkbox,
  Combobox,
  CreateContactAccountForm,
  Input,
} from "@/app/lib/@frontend/ui/component";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { WhatsappIcon } from "@/app/lib/@frontend/svg/whatsapp-icon";

type ContactAccountFormProps = {
  contacts: {
    name: string;
    contacts: IContact[];
    documentValue: string;
  }[];
  isLoading?: boolean;
  accountData?: IAccount;
  closeModal: () => void;
};

export function SearchContactHistoricalAccountForm({
  contacts,
  isLoading,
  accountData = {} as IAccount,
  closeModal,
}: ContactAccountFormProps) {
  const {
    handleSave,
    toggleCheckbox,
    selectedIds,
    setSelectedIds,
    contactData,
  } = useSearchContactHistoricalAccount({ accountData, contacts, closeModal });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto flex flex-col gap-4">
        {(contactData ?? []).map((company) => (
          <Disclosure key={company.documentValue}>
            {({ open }) => (
              <>
                <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-black bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <span>{company.name}</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } w-5 h-5 text-purple-500`}
                  />
                </DisclosureButton>

                <DisclosurePanel className="px-4 pb-2 text-sm text-gray-700 flex flex-col gap-2">
                  {company.contacts.map((c) => (
                    <label key={c.id} className="flex items-center gap-2">
                      {c.contactItems.map((ci) => (
                        <>
                          <span className="text-gray-500 text-sm">
                            {ci.type + ": " + ci.contact}
                          </span>
                          <div className="flex gap-2">
                            {(ci.type === "Celular" ||
                              ci.type === "Telefone Residencial" ||
                              ci.type === "Telefone Comercial") && (
                              <label className="flex items-center">
                                <Checkbox checked={false} onClick={() => {}} />
                                <PhoneIcon className="w-5 h-5" />
                              </label>
                            )}

                            {ci.type === "Email" && (
                              <label className="flex items-center">
                                <Checkbox checked={false} onClick={() => {}} />
                                <EnvelopeIcon className="w-5 h-5" />
                              </label>
                            )}

                            {ci.type === "Celular" && (
                              <label className="flex items-center">
                                <Checkbox checked={false} onClick={() => {}} />
                                <WhatsappIcon classname="w-5 h-5" />
                              </label>
                            )}
                          </div>
                        </>
                      ))}
                    </label>
                  ))}
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ))}
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-black bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Outro</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } w-5 h-5 text-purple-500`}
                />
              </DisclosureButton>

              <DisclosurePanel className="px-4 pb-2 text-sm text-gray-700 flex flex-col gap-2">
                <Input label="Nome" onChange={() => {}} />
                <div className="grid grid-cols-2 gap-2">
                  <Combobox
                    data={[
                      "Celular",
                      "Email",
                      "Telefone Residencial",
                      "Telefone Comercial",
                    ]}
                    onChange={(value) => {}}
                    label="Tipo"
                    type="single"
                    placeholder="Selecione o tipo"
                    keyExtractor={(item) => item}
                    displayValueGetter={(item) => item}
                  />
                  <Input label="Contato" onChange={() => {}} />
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>

      <div className="flex justify-end gap-4 w-full pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setSelectedIds([])}
        >
          Cancelar
        </Button>
        <Button type="button" onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
