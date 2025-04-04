"use client";

import { Controller } from "react-hook-form";
import { Button, Checkbox, Input, Select } from "../../../../component";
import { useCreateOneUserForm } from "./use-create-one.user.form";
import { Combobox } from "@bwsoft/combobox";

export function CreateOneUserForm() {
    const { 
        handleSubmit, 
        register, 
        control, 
        profiles,
        errors
    } = useCreateOneUserForm();

    return (
        <form action={() => handleSubmit()} className="mt-10">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Informações do usuário
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Preencha com os dados referente ao usuário.
            </p>
           </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="md:col-span-2">
                <Controller 
                    control={control}
                    name="internal"
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
                {...register("cpf")}
                error={errors.cpf?.message}
            />

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
            name="profile_id"
            render={({ field }) => (
                <Combobox
                label="Perfis"
                className="mt-2"
                type="multiple"
                data={profiles ?? []}
                error={errors.profile_id?.message}
                onOptionChange={(items) => {
                    console.log(items)
                    field.onChange(items.map((item) => item.id));
                }}
                keyExtractor={(item) => item.id}
                displayValueGetter={(item) => item.name}
                />
            )}
            />

        </div>

  
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancelar
          </button>
          <Button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Salvar
          </Button>
        </div>
      </form>
    )
}