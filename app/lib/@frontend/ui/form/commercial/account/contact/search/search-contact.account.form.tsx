"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Button } from "../../../../../component";
import { useSearchContactAccount } from "./use-search-contact.account";
import { IAccount, IContact } from "@/app/lib/@backend/domain";

type ContactAccountFormProps = {
  contacts: {
    name: string;
    contacts: IContact[];
    documentValue: string;
  }[];
  isLoading?: boolean;
  accountData?: IAccount;
};

export function SearchContactAccountForm({
  contacts,
  isLoading,
  accountData = {} as IAccount,
}: ContactAccountFormProps) {
  const {
    handleSave,
    toggleCheckbox,
    selectedIds,
    setSelectedIds,
    contactData,
  } = useSearchContactAccount({ accountData, contacts });

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
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={(e) => toggleCheckbox(c.id, e.target.checked)}
                      />
                      {c.name}
                    </label>
                  ))}
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ))}
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
