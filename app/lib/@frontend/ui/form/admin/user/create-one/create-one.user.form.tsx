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
                    field.onChange(items.map((item) => item.id));
                }}
                keyExtractor={(item) => item.id}
                displayValueGetter={(item) => item.name}
                />
            )}
            />
        </div>
  
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            type="button"
            variant={"ghost"}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
          >
            Salvar
          </Button>
        </div>
      </form>
    )
}