"use client";

import { Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  Combobox,
  Input,
  useUpdateContactAccount,
} from "../../../../../component";
import { PlusIcon } from "@heroicons/react/24/outline";
import { IContact } from "@/app/lib/@backend/domain";
import { ContactTable } from "@/app/lib/@frontend/ui/table/commercial/contact/table";

type Props = {
  closeModal: () => void;
  contact: IContact;
};

export function UpdateContactAccountForm({ closeModal, contact }: Props) {
  const {
    control,
    register,
    watch,
    fields,
    onSubmit,
    handleNewContact,
    handlePreferredContact,
    handleRemove,
  } = useUpdateContactAccount(closeModal, contact);

  return (
    <form
      action={() => onSubmit()}
      className="flex flex-col items-start  gap-4"
    >
      <Controller
        name="contractEnabled"
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

      <Input label={"Nome"} {...register("name")} />

      <Input label={"Cargo/Relação"} {...register("positionOrRelation")} />

      <Input label={"Área"} {...register("department")} />

      {watch("contractEnabled") && (
        <>
          <Input label={"CPF"} {...register("cpf")} />
          <Input label={"RG"} {...register("rg")} />
        </>
      )}

      <div className="flex gap-4 justify-between w-full items-end">
        <Controller
          name="contactItems.0.type"
          control={control}
          render={({ field }) => (
            <Combobox
              data={[
                "Celular",
                "Email",
                "Telefone Residencial",
                "Telefone Comercial",
              ]}
              value={field.value}
              onChange={field.onChange}
              label="Tipo"
              type="single"
              placeholder="Selecione o tipo"
              keyExtractor={(item) => item}
              displayValueGetter={(item) => item}
            />
          )}
        />

        <Input label="Contato" {...register(`contactItems.0.contact`)} />
        <div
          className="bg-black text-white rounded-full p-1 mb-1.5 cursor-pointer"
          onClick={handleNewContact}
        >
          <PlusIcon className="text-white w-5 h-5" />
        </div>
      </div>

      {fields.length > 0 && (
        <ContactTable
          data={fields}
          handlePreferredContact={handlePreferredContact}
          handleRemove={handleRemove}
        />
      )}

      <h2>Contato para </h2>
      <div className="flex gap-4">
        <Controller
          name={`contactFor`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value?.includes("Comercial")}
              onChange={(checked) => {
                const newValue = checked
                  ? [...(field.value || []), "Comercial"]
                  : field.value?.filter((item: string) => item !== "Comercial");
                field.onChange(newValue);
              }}
              label="Comercial"
            />
          )}
        />
        <Controller
          name={`contactFor`}
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
          name={`contactFor`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value?.includes("Faturamento")}
              onChange={(checked) => {
                const newValue = checked
                  ? [...(field.value || []), "Faturamento"]
                  : field.value?.filter(
                      (item: string) => item !== "Faturamento"
                    );
                field.onChange(newValue);
              }}
              label="Faturamento"
            />
          )}
        />
        <Controller
          name={`contactFor`}
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
        <Button type="button" variant={"ghost"} onClick={closeModal}>
          Cancelar
        </Button>

        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
