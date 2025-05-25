"use client";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { useCreateBaseForm } from "./use-create.base.form";
import { Input, Radio, Textarea } from "../../../../component";
import { Controller } from "react-hook-form";
import { baseConstants } from "@/app/lib/constant/logistic";
import { IEnterprise } from "@/app/lib/@backend/domain";
import { Select } from "../../../../composite";

interface Props {
  enterprises: IEnterprise[];
}
export function CreateOneBaseForm(props: Props) {
  const { enterprises } = props;
  const { handleSubmit, register, handleCancelCreate, errors, control } =
    useCreateBaseForm();

  return (
    <form action={() => handleSubmit()}>
      <div className="border-b border-gray-900/10 pb-6">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
          <Input
            {...register("code")}
            type="text"
            id="code"
            label="Código da base"
            autoComplete="code"
            placeholder="Digite o código da base"
            className="w-full"
            error={errors.code?.message}
            help="Código identificador da base no sistema"
          />
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                name="type"
                data={Object.entries(baseConstants.type).map(
                  ([key, value]) => ({
                    label: value,
                    value: key,
                  })
                )}
                labelExtractor={(d) => d.label}
                keyExtractor={(d) => d.value}
                valueExtractor={(d) => d.label}
                label="Tipo da base"
                value={Object.entries(baseConstants.type)
                  .map(([key, value]) => ({
                    label: value,
                    value: key,
                  }))
                  .find(({ value }) => value === field.value)}
                onChange={(d) => field.onChange(d.value)}
                help="Categoria funcional da base"
              />
            )}
          />
          <Controller
            control={control}
            name="enterprise"
            render={({ field }) => (
              <Radio
                name="enterprise"
                label="Empresa Vinculada"
                help="Selecione a empresa que relacionada a esta base"
                data={enterprises}
                keyExtractor={(d) => d.id}
                valueExtractor={(d) => ({
                  id: d.id,
                  name: { short: d.name.short },
                })}
                labelExtractor={(d) => d.name.short}
                onChange={(d) => field.onChange(d)}
              />
            )}
          />
          <Textarea
            {...register("description")}
            label="Descrição"
            placeholder="Descreva a finalidade e características da base"
            help="Informações adicionais sobre a base (opcional)"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleCancelCreate}
            type="button"
          >
            Cancelar
          </Button>
          <Button type="submit" variant="default">
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
}
