"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { ContactSelection, IContact } from "@/app/lib/@backend/domain";
import {
  Button,
  Checkbox,
  Combobox,
  Input,
  useSearchContactHistoricalAccount,
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
  closeModal: () => void;
  selectContact: ContactSelection;
  setSelectContact: (
    value:
      | ContactSelection
      | ((prev: ContactSelection | undefined) => ContactSelection | undefined)
      | undefined
  ) => void;
};

export function SearchContactHistoricalAccountForm({
  contacts,
  closeModal,
  selectContact,
  setSelectContact,
}: ContactAccountFormProps) {  
  
  const { toggleSelection, isSelected, handleAddOtherContact, otherContactInfo, setOtherContactInfo, contactData} = useSearchContactHistoricalAccount({
    contacts,
    selectContact,
    setSelectContact
  });
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto flex flex-col gap-4">
       {(contactData ?? []).map((company) => (
          <Disclosure key={company.documentValue}>
            {({ open }) => (
              <>
                <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-black bg-gray-100 rounded-lg hover:bg-gray-200">
                  <span>{company.name}</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } w-5 h-5 text-purple-500`}
                  />
                </DisclosureButton>
                <DisclosurePanel className="px-4 pb-2 flex flex-col gap-2">
                  {company.contacts.map((c) =>
                    c.contactItems.map((ci) => (
                      <label key={ci.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={isSelected(ci.id)}
                          onChange={() =>
                            toggleSelection(ci.id, company.name, ci.type, ci.contact)
                          }
                        />
                        <span className="text-gray-500 text-sm">
                          {ci.type + ": " + ci.contact}
                        </span>
                        <div className="flex gap-2">
                          {ci.type.includes("Telefone") && (
                            <PhoneIcon className="w-5 h-5" />
                          )}
                          {ci.type === "Email" && (
                            <EnvelopeIcon className="w-5 h-5" />
                          )}
                          {ci.type === "Celular" && (
                            <WhatsappIcon classname="w-5 h-5" />
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ))}

        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-black bg-gray-100 rounded-lg hover:bg-gray-200">
                <span>Outro</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } w-5 h-5 text-purple-500`}
                />
              </DisclosureButton>
              <DisclosurePanel className="px-4 pb-2 flex flex-col gap-2">
                <Input
                  label="Nome"
                  value={otherContactInfo.name}
                  onChange={(e) =>
                    setOtherContactInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Combobox
                    data={[
                      "Celular",
                      "Email",
                      "Telefone Residencial",
                      "Telefone Comercial",
                    ]}
                    value={otherContactInfo.type ? [otherContactInfo.type] : []}
                    onChange={(value) =>
                      setOtherContactInfo((prev) => ({
                        ...prev,
                        type: Array.isArray(value) ? (value[0] ?? "") : value,
                      }))
                    }
                    label="Tipo"
                    type="single"
                    placeholder="Selecione o tipo"
                    keyExtractor={(item) => item}
                    displayValueGetter={(item) => item}
                  />
                  <Input
                    label="Contato"
                    value={otherContactInfo.contact}
                    onChange={(e) =>
                      setOtherContactInfo((prev) => ({
                        ...prev,
                        contact: e.target.value,
                      }))
                    }
                  />
                </div>
                <Button type="button" onClick={handleAddOtherContact}>
                  Adicionar Contato
                </Button>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>

      <div className="flex justify-end gap-4 w-full pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setSelectContact({
            id: "",
            name: "",
            type: "",
            contact: ""
          })}
        >
          Cancelar
        </Button>
        <Button type="button" onClick={closeModal}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
 