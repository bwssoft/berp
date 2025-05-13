"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Button,
  Checkbox,
  Combobox,
  ContactTable,
  Input,
} from "../../../../component";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useContactAccount } from "./use-contact.account";
import { CreateAccountFormSchema } from "./use-create.account.form";

export function ContactAccountForm() {
  const { contactData, handleNewContact } = useContactAccount();
  const { register, control } = useFormContext<CreateAccountFormSchema>();

  return (
    <div className="flex flex-col items-start  gap-4 ">
      <Controller
        name="contact.contractEnabled"
        control={control}
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

      <Input label={"Nome"} {...register("contact.name")} />

      <Input
        label={"Cargo/Relação"}
        {...register("contact.positionOrRelation")}
      />

      <Input label={"Área"} {...register("contact.department")} />

      {false && (
        <>
          <Input label={"CPF"} {...register("contact.cpf")} />
          <Input label={"RG"} {...register("contact.rg")} />
        </>
      )}

      <div className="flex gap-4 justify-between w-full items-end">
        <Controller
          name="contact.contactItems.0.type"
          control={control}
          render={({ field }) => (
            <Combobox
              data={[
                "Celular",
                "Email",
                "Telefone Residencial",
                "Telefone Comercial",
              ]}
              value={[field.value]}
              onChange={field.onChange}
              label="Tipo"
              type="single"
              placeholder="Selecione o tipo"
              keyExtractor={(item) => item}
              displayValueGetter={(item) => item}
            />
          )}
        />

        <Input
          label="Contato"
          {...register(`contact.contactItems.0.contact`)}
        />
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
          name={`contact.contactItems.0.contactFor`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value?.includes("Comercial")}
              onChange={(checked) => {
                const newValue = checked
                  ? [...(field.value || []), "Comercial"]
                  : field.value?.filter((item) => item !== "Comercial");
                field.onChange(newValue);
              }}
              label="Comercial"
            />
          )}
        />
        <Controller
          name={`contact.contactItems.0.contactFor`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value?.includes("Suporte")}
              onChange={(checked) => {
                const newValue = checked
                  ? [...(field.value || []), "Suporte"]
                  : field.value?.filter((item) => item !== "Suporte");
                field.onChange(newValue);
              }}
              label="Suporte"
            />
          )}
        />
        <Controller
          name={`contact.contactItems.0.contactFor`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value?.includes("Faturamento")}
              onChange={(checked) => {
                const newValue = checked
                  ? [...(field.value || []), "Faturamento"]
                  : field.value?.filter((item) => item !== "Faturamento");
                field.onChange(newValue);
              }}
              label="Faturamento"
            />
          )}
        />
        <Controller
          name={`contact.contactItems.0.contactFor`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={
                Array.isArray(field.value) && field.value.includes("Marketing")
              }
              onChange={(checked) => {
                const newValue = checked
                  ? [...(field.value || []), "Marketing"]
                  : field.value?.filter((item) => item !== "Marketing");
                field.onChange(newValue);
              }}
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
