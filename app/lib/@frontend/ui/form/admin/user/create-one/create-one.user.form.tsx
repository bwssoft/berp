"use client";

import { Controller } from "react-hook-form";
import { Button, Checkbox, Input } from "../../../../component";
import { useCreateOneUserForm } from "./use-create-one.user.form";
import { Combobox } from "@bwsoft/combobox";

export function CreateOneUserForm() {
  const { handleSubmit, register, control, profiles, errors, handleCancelEdit, handleBackPage } =
    useCreateOneUserForm();

  return (
    <form
      action={() => handleSubmit()}
      className="bg-white px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset ring-gray-900/10"
    >
      <div className="border-b border-gray-900/10 pb-6">
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="md:col-span-2">
            <Controller
              control={control}
              name="external"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  label="Usuário externo"
                />
              )}
            />
          </div>

          <Input label="CPF" {...register("cpf")} error={errors.cpf?.message} />

          <Input
            label="Nome completo"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Usuário"
            {...register("username")}
            error={errors.username?.message}
          />

          <Input
            label="Imagem (URL)"
            {...register("image")}
            error={errors.image?.message}
          />

          <Controller
            control={control}
            name="profile"
            render={({ field }) => (
              <Combobox
                label="Perfis"
                className="mt-2"
                type="multiple"
                data={profiles ?? []}
                error={errors.profile?.message}
                onOptionChange={(items) => {
                  field.onChange(items);
                }}
                keyExtractor={(item) => item.id}
                displayValueGetter={(item) => item.name}
              />
            )}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-between mt-6">
          <div>
              <Button
                  variant="ghost"
                  onClick={handleBackPage}
                  type="button"
              >
                  Voltar
              </Button>
          </div>
          <div className="flex gap-2">
              <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  type="button"
              >
                  Cancelar
              </Button>
              <Button type="submit" variant="default">Salvar</Button>
          </div>
      </div>
    </form>
  );
}
