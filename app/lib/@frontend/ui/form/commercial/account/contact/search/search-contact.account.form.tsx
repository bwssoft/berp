// SearchContactAccountForm.tsx
"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Button } from "../../../../../component";
import { useSearchContactAccount } from "./use-search-contact.account";
import { IContact } from "@/app/lib/@backend/domain";

type ContactAccountFormProps = {
  contacts: IContact[];
};

export function SearchContactAccountForm({
  contacts,
}: ContactAccountFormProps) {
  const {} = useSearchContactAccount();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto flex flex-col gap-4">
        {contacts.map((contact, index) => (
          <Disclosure key={contact.id ?? ""}>
            {({ open }) => (
              <>
                <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-black bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <span>Empresa {index + 1}</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } w-5 h-5 text-purple-500`}
                  />
                </DisclosureButton>
                <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-500 flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    {contact.name}
                  </label>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ))}
      </div>

      <div className="flex justify-end gap-4 w-full">
        <Button type="button" variant="ghost" onClick={() => {}}>
          Cancelar
        </Button>
        <Button type="button" onClick={() => {}}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
