"use client";

import { Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  Combobox,
  Input,
  useCreateContactAccount,
} from "../../../../../component";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ContactTable } from "@/app/lib/@frontend/ui/table/commercial/contact/table";

type Props = {
  closeModal?: () => void;
};

export function CreateContactAccountForm({ closeModal }: Props) {
  const {
    control,
    register,
    watch,
    fields,
    onSubmit,
    handleNewContact,
    handlePreferredContact,
    handleRemove,
    setTempContact,
    formState: { errors },
  } = useCreateContactAccount(closeModal ?? (() => {}));

  return (
    <form
      action={() => onSubmit()}
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
            {...register("cpf")}
            error={errors.cpf?.message}
          />
          <Input
            placeholder="Digite o RG do contato"
            label={"RG"}
            {...register("rg")}
            error={errors.rg?.message}
          />
        </>
      )}

      <div className="flex gap-4 justify-between w-full items-end">
        <Combobox
          data={[
            "Celular",
            "Email",
            "Telefone Residencial",
            "Telefone Comercial",
          ]}
          onChange={([value]) => {
            setTempContact((prev) => ({
              ...prev,
              type: value as typeof prev.type,
            }));
          }}
          label="Tipo"
          type="single"
          placeholder="Selecione o tipo"
          keyExtractor={(item) => item}
          displayValueGetter={(item) => item}
        />

        <Input
          label="Contato"
          onChange={(e) =>
            setTempContact((prev) => ({
              ...prev,
              contact: e.target.value,
            }))
          }
          placeholder="Adicione o contato"
          error={errors.contactItems?.message}
        />

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

      <div>
        {errors.contactFor && (
          <p className="text-red-500 text-sm mt-1">
            {errors.contactFor.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4 w-full">
        <Button type="button" variant={"ghost"} onClick={() => {}}>
          Cancelar
        </Button>

        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
