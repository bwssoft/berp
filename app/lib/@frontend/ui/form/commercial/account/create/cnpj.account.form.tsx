"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Input, Combobox } from "../../../../component";

const sectorOptions = [
  { id: "retail", name: "Varejo" },
  { id: "industry", name: "Indústria" },
  { id: "services", name: "Serviços" },
];

export function CNPJAccountForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateAccountFormSchema>();

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Razão Social"
        placeholder="Digite a razão social"
        {...register("cnpj.social_name")}
        error={errors.cnpj?.social_name?.message}
      />
      <Input
        label="Nome Fantasia"
        placeholder="Digite o nome fantasia"
        {...register("cnpj.fantasy_name")}
        error={errors.cnpj?.fantasy_name?.message}
      />
      <Input
        label="Inscrição Estadual"
        placeholder="Digite a inscrição estadual"
        {...register("cnpj.state_registration")}
        error={errors.cnpj?.state_registration?.message}
      />
      <Input
        label="Situação"
        placeholder="Sem restrição"
        {...register("cnpj.status")}
        error={errors.cnpj?.status?.message}
      />
      <Input
        label="Inscrição Municipal"
        placeholder="Digite a inscrição municipal"
        {...register("cnpj.municipal_registration")}
        error={errors.cnpj?.municipal_registration?.message}
      />

      <Controller
        control={control}
        name="cnpj.sector"
        render={({ field }) => (
          <Combobox
            label="Setor"
            placeholder="Selecione o setor"
            className="mt-1 text-left"
            data={sectorOptions}
            error={errors.cnpj?.sector?.message}
            onOptionChange={field.onChange}
            keyExtractor={(item) => item.id}
            displayValueGetter={(item) => item.name}
          />
        )}
      />

      <Input
        label="Grupo Econômico (Holding)"
        placeholder="Digite o CNPJ, Razão Social ou Nome Fantasia..."
        {...register("cnpj.economic_group_holding")}
        error={errors.cnpj?.economic_group_holding?.message}
      />
      <Input
        label="Grupo Econômico (Controladas)"
        placeholder="Digite o CNPJ, Razão Social ou Nome Fantasia..."
        {...register("cnpj.economic_group_controlled")}
        error={errors.cnpj?.economic_group_controlled?.message}
      />
    </div>
  );
}
