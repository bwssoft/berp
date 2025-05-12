"use client";

import { Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  Combobox,
  ContactTable,
  Input,
} from "../../../../component";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useContactAccount } from "./use-contact.account";

export function ContactAccountForm() {
  const { contactData, setContactData, handleNewContact } = useContactAccount();

  return (
    <div className="flex flex-col items-start  gap-4 ">
      <Controller
        name=""
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            label="Contrato"
          />
        )}
      />

      <Input label={"Nome"} />

      <Input label={"Cargo/Relação"} />

      <Input label={"Área"} />

      {false && (
        <>
          <Input label={"CPF"} />
          <Input label={"RG"} />
        </>
      )}

      <div className="flex gap-4 justify-between w-full items-end">
        <Controller
          name=""
          render={({ field }) => (
            <Combobox
              data={[
                "Celular",
                "Email",
                "Telefone Residencial",
                "Telefone Comercial",
              ]}
              onChange={field.onChange}
              label="Tipo"
              placeholder="Selecione o tipo"
              keyExtractor={(item) => item}
              displayValueGetter={(item) => item}
            />
          )}
        />

        <Input label="Contato" />
        <div
          className="bg-black text-white rounded-full p-1 mb-1.5 cursor-pointer"
          onClick={() => handleNewContact("celular", "77998562656", "teste")}
        >
          <PlusIcon className="text-white w-5 h-5" />
        </div>
      </div>
      {contactData.length > 0 && <ContactTable data={contactData} />}

      <h2>Contato para </h2>
      <div className="flex gap-4">
        <Controller
          name=""
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              label="Comercial"
            />
          )}
        />
        <Controller
          name=""
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              label="Suporte"
            />
          )}
        />
        <Controller
          name=""
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              label="Faturamento"
            />
          )}
        />
        <Controller
          name=""
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              label="Marketing"
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-4 w-full">
        <Button type="button" variant={"ghost"} onClick={() => {}}>
          Cancelar
        </Button>

        <Button type="button" onClick={() => {}}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
