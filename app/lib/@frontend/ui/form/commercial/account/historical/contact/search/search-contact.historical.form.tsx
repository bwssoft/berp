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

import { Controller } from "react-hook-form";
import { maskPhone } from "@/app/lib/util/format-phone";
import { WhatsappIcon } from "@/app/lib/@frontend/svg/whatsapp-icon";
import { useState } from "react";

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
  const [showOutroForm, setShowOutroForm] = useState(false);

  const {
    toggleSelection,
    isSelected,
    otherContactInfo,
    setOtherContactInfo,
    contactData,
    control,
    errors,
    trigger,
    validateAndConfirm,
  } = useSearchContactHistoricalAccount({
    contacts,
    selectContact,
    setSelectContact,
  });

  const handleConfirm = async () => {
    if (showOutroForm) {
      // If outro form is shown, validate before closing
      const isValid = await validateAndConfirm();
      if (!isValid) {
        return; // Don't close modal if validation fails
      }
    }
    closeModal();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto flex flex-col gap-4">
        {/* Checkbox to toggle between contact list and outro form */}
        <div className="flex items-center gap-2 p-4 rounded-lg">
          <Checkbox
            checked={showOutroForm}
            onChange={(e) => setShowOutroForm(e.target.checked)}
          />
          <label className="text-sm font-medium">Outros</label>
        </div>

        {showOutroForm ? (
          /* Outro Form */
          <div className="px-4 pb-2 flex flex-col gap-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  label="Nome"
                  placeholder="Digite o nome do contato"
                  value={otherContactInfo.name}
                  error={errors.name?.message}
                  onChange={async (e) => {
                    setOtherContactInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                    field.onChange(e.target.value);
                    await trigger("name");
                  }}
                />
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Combobox
                    data={[
                      "Celular",
                      "Email",
                      "Telefone Residencial",
                      "Telefone Comercial",
                    ]}
                    error={errors.type?.message}
                    value={otherContactInfo.type ? [otherContactInfo.type] : []}
                    onChange={async (value) => {
                      const selectedType = Array.isArray(value)
                        ? value[0]
                        : value;
                      setOtherContactInfo((prev) => ({
                        ...prev,
                        type: selectedType,
                      }));
                      field.onChange([selectedType]);
                      await trigger("type");
                    }}
                    label="Tipo"
                    type="single"
                    placeholder="Selecione o tipo"
                    keyExtractor={(item) => item}
                    displayValueGetter={(item) => item}
                  />
                )}
              />

              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Contato"
                    placeholder="Digite o contato"
                    value={field.value}
                    error={errors.contact?.message}
                    onChange={async (e) => {
                      let val = e.target.value;
                      const t = otherContactInfo.type;
                      if (t === "Celular" || t.includes("Telefone")) {
                        val = maskPhone(val);
                      }
                      setOtherContactInfo((prev) => ({
                        ...prev,
                        contact: val,
                      }));
                      field.onChange(val);
                      await trigger("contact");
                    }}
                  />
                )}
              />
            </div>
          </div>
        ) : (
          /* Contact Disclosures */
          contactData?.map((company) => (
            <Disclosure key={company.documentValue}>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-black bg-gray-100 rounded-lg hover:bg-gray-200">
                    <span>{company.name}</span>
                    <ChevronUpIcon
                      className={`${open ? "rotate-180 transform" : ""} w-5 h-5 text-purple-500`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pb-2 flex flex-col gap-2">
                    {company.contacts.map((c) =>
                      c.contactItems.map((ci) => (
                        <label key={ci.id} className="flex items-center gap-1">
                          <span className="text-gray-500 text-sm">
                            {ci.type + ": " + ci.contact}
                          </span>
                          <Checkbox
                            checked={isSelected(ci.id, ci.type)}
                            onChange={() =>
                              toggleSelection(
                                ci.id,
                                company.name,
                                ci.type,
                                ci.contact,
                                ci.type
                              )
                            }
                          />
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
                          {ci.type === "Celular" && (
                            <label className="flex items-center gap-1">
                              <Checkbox
                                checked={isSelected(ci.id, "Whatsapp")}
                                onChange={() =>
                                  toggleSelection(
                                    ci.id,
                                    company.name,
                                    ci.type,
                                    ci.contact,
                                    "Whatsapp"
                                  )
                                }
                              />
                              <PhoneIcon className="w-5 h-5" />
                            </label>
                          )}
                        </label>
                      ))
                    )}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          ))
        )}
      </div>

      <div className="flex justify-end gap-4 w-full pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            setSelectContact({
              id: "",
              name: "",
              type: "",
              contact: "",
              channel: "",
            })
          }
        >
          Cancelar
        </Button>
        <Button type="button" onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
