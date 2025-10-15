"use client";

import { Controller } from "react-hook-form";
import { Button } from '@/frontend/ui/component/button';
import { Checkbox } from '@/frontend/ui/component/checkbox';
import { Combobox } from '@/frontend/ui/component/combobox/index';
import { ContactFormSchema, useCreateContactAccount } from '@/frontend/ui/form/commercial/account/contact/create/use-contact.create.account';
import { Input } from '@/frontend/ui/component/input';

import { ContactFormSchemaWithOrigin } from "./use-contact.create.account";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ContactTable } from "@/app/lib/@frontend/ui/table/commercial/contact/table";
import { maskPhoneNumber } from "@/app/lib/util/mask-phone-number";
import { formatCpf, formatRgOrCpf } from "@/app/lib/util/format-rg-cpf";

type Props = {
  closeModal?: () => void;
  onSubmit: (
    data: ContactFormSchemaWithOrigin,
    accountId?: string
  ) => Promise<void>;
};

export function CreateContactAccountForm({ closeModal, onSubmit }: Props) {
  const {
    control,
    register,
    watch,
    fields,
    handleSubmit,
    handleNewContact,
    handlePreferredContact,
    handleRemove,
    handleCheckboxChange,
    setTempContact,
    tempContact,
    isLoading,
    formState: { errors },
  } = useCreateContactAccount(closeModal ?? (() => {}), onSubmit);

  type ContactType =
    | "Celular"
    | "Email"
    | "Telefone Residencial"
    | "Telefone Comercial";

  return (
    <form
      action={() => handleSubmit()}
      className="flex flex-col items-start gap-4"
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

      <Input
        placeholder="Digite o nome do contato"
        label={"Nome"}
        {...register("name")}
        error={errors.name?.message}
      />

      <Input
        placeholder="Digite o cargo ou relação"
        label={"Cargo/Relação"}
        {...register("positionOrRelation")}
        error={errors.positionOrRelation?.message}
      />

      <Input
        placeholder="Digite departamento"
        label={"Área"}
        {...register("department")}
        error={errors.department?.message}
      />

      {watch("contractEnabled") && (
        <>
          <Input
            placeholder="Digite o CPF do contato"
            label={"CPF"}
            {...register("cpf", {
              onChange: (e) => {
                e.target.value = formatCpf(e.target.value);
              },
            })}
            error={errors.cpf?.message}
          />
          <Input
            placeholder="Digite o RG do contato "
            label={"RG / CIN"}
            {...register("rg", {
              onChange: (e) => {
                e.target.value = formatRgOrCpf(e.target.value);
              },
            })}
            error={errors.rg?.message}
          />
        </>
      )}

      <div className="flex gap-4 w-full items-start">
        <Combobox
          data={[
            "Celular",
            "Email",
            "Telefone Residencial",
            "Telefone Comercial",
          ]}
          label="Tipo"
          type="single"
          placeholder="Selecione o tipo"
          value={tempContact.type ? [tempContact.type as string] : undefined}
          onChange={(val) => {
            const selected = Array.isArray(val) ? val[0] : val;
            setTempContact((prev) => ({
              ...prev,
              type: selected as ContactType,
            }));
          }}
          keyExtractor={(item) => item}
          displayValueGetter={(item) => item}
        />
        <Input
          label="Contato"
          onChange={(e) => {
            const value = e.target.value;
            const formattedValue = [
              "Celular",
              "Telefone Residencial",
              "Telefone Comercial",
            ].includes(tempContact.type as string)
              ? maskPhoneNumber(value, tempContact.type as string)
              : value;

            setTempContact((prev) => ({
              ...prev,
              contact: formattedValue,
            }));
          }}
          value={tempContact.contact}
          placeholder={
            tempContact.type === "Celular"
              ? "(00) 00000-0000"
              : tempContact.type === "Telefone Residencial" ||
                  tempContact.type === "Telefone Comercial"
                ? "(00) 0000-0000"
                : "Adicione o contato"
          }
          error={errors.contactItems?.message}
        />

        <div
          className="self-center p-0.5 mt-auto bg-black text-white rounded-full cursor-pointer"
          onClick={handleNewContact}
        >
          <PlusIcon className="text-white w-7 h-7" />
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
              onChange={(e) =>
                field.onChange(
                  handleCheckboxChange(
                    field.value,
                    "Comercial",
                    e.target.checked
                  )
                )
              }
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
              onChange={(e) =>
                field.onChange(
                  handleCheckboxChange(field.value, "Suporte", e.target.checked)
                )
              }
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
              onChange={(e) =>
                field.onChange(
                  handleCheckboxChange(
                    field.value,
                    "Faturamento",
                    e.target.checked
                  )
                )
              }
              label="Faturamento"
            />
          )}
        />

        <Controller
          name={`contactFor`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value?.includes("Marketing")}
              onChange={(e) =>
                field.onChange(
                  handleCheckboxChange(
                    field.value,
                    "Marketing",
                    e.target.checked
                  )
                )
              }
              label="Marketing"
            />
          )}
        />
      </div>

      <div>
        {errors.contactFor && (
          <p className="text-red-500 text-sm mt-1">
            {errors.contactFor.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4 w-full">
        <Button
          type="button"
          variant={"ghost"}
          onClick={closeModal}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
