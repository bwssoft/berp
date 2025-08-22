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
  const [openDisclosure, setOpenDisclosure] = useState<string | null>(null);

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
    tempSelectedContact,
  } = useSearchContactHistoricalAccount({
    contacts,
    selectContact,
    setSelectContact,
  });

  const handleConfirm = async () => {
    const isValid = await validateAndConfirm();
    if (!isValid) {
      return;
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
            <div
              key={company.documentValue}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              <Disclosure>
                {({ open }) => {
                  const isOpen = openDisclosure === company.documentValue;
                  return (
                    <>
                      <DisclosureButton 
                        className="flex justify-between w-full px-6 py-4 text-base font-semibold text-left text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-all duration-200"
                        onClick={() => {
                          if (isOpen) {
                            setOpenDisclosure(null);
                          } else {
                            setOpenDisclosure(company.documentValue);
                          }
                        }}
                      >
                        <span className="text-base">{company.name}</span>
                        <ChevronUpIcon
                          className={`${isOpen ? "rotate-180 transform" : ""} w-6 h-6 text-blue-600 transition-transform duration-200`}
                        />
                      </DisclosureButton>
                      {isOpen && (
                        <DisclosurePanel 
                          static 
                          className="px-6 py-4 bg-white max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        >
                          <div className="space-y-3">
                        {company.contacts.map((c) =>
                          c.contactItems.map((ci) => (
                            <div
                              key={ci.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700">
                                  {ci.type}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {ci.contact}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  {ci.type.includes("Telefone") && (
                                    <PhoneIcon className="w-5 h-5 text-blue-600" />
                                  )}
                                  {ci.type === "Email" && (
                                    <EnvelopeIcon className="w-5 h-5 text-green-600" />
                                  )}
                                  {ci.type === "Celular" && (
                                    <WhatsappIcon classname="w-5 h-5 text-green-600" />
                                  )}
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
                                </div>
                                {ci.type === "Celular" && (
                                  <div className="flex items-center gap-2">
                                    <PhoneIcon className="w-5 h-5 text-green-600" />
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
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </DisclosurePanel>
                      )}
                    </>
                  );
                }}
              </Disclosure>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-4 w-full pt-4">
        {tempSelectedContact && (
          <div className="flex-1 text-sm text-gray-600 bg-blue-50 p-4 rounded">
            <strong>Selecionado:</strong> {tempSelectedContact.name} -{" "}
            {tempSelectedContact.contact}
            <div className="text-xs text-gray-500">
              Pressione &quot;Confirmar&quot; para adicionar
            </div>
          </div>
        )}
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
