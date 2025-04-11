"use client";

import { Controller } from "react-hook-form";
import { Button, Checkbox, Input } from "../../../../component";
import { useCreateOneUserForm } from "./use-create-one.user.form";
import { Combobox } from "@bwsoft/combobox";

export function CreateOneUserForm() {
  const { handleSubmit, register, control, profiles, errors, handleCancelEdit } =
    useCreateOneUserForm();

  return (
    <form
      action={() => handleSubmit()}
      className="bg-white px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset ring-gray-900/10 w-full"
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

          <Input
            label="CPF"
            placeholder="Digite o CPF"
            {...register("cpf")}
            error={errors.cpf?.message}
          />

          <Input
            label="Nome completo"
            placeholder="Digite o nome completo"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Digite o email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Usuário"
            placeholder="Digite o nome de usuário"
            {...register("username")}
            error={errors.username?.message}
          />

          <Input
            label="Imagem (URL)"
            placeholder="Cole a URL da imagem"
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
                value={field.value}
                keyExtractor={(item) => item.id}
                displayValueGetter={(item) => item.name}
                placeholder="Selecione um ou mais perfis"
              />
            )}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-6">
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
