"use client";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { useUpdateBaseForm } from "./use-update.base.form";
import { Input } from '@/frontend/ui/component/input';
import { Radio } from '@/frontend/ui/component/radio';
import { Textarea } from '@/frontend/ui/component/text-area';

import { Controller } from "react-hook-form";
import { baseConstants } from "@/app/lib/constant/logistic";
import {IBase} from "@/app/lib/@backend/domain/logistic/entity/base.entity";
import {IEnterprise} from "@/app/lib/@backend/domain/business/entity/enterprise.entity";
import { Select } from '@/frontend/ui/composite/select';


interface Props {
  enterprises: IEnterprise[];
  base: IBase;
}
export function UpdateOneBaseForm(props: Props) {
  const { enterprises, base } = props;
  const { handleSubmit, register, handleCancelUpdate, errors, control } =
    useUpdateBaseForm({ defaultValues: base });

  return (
    <form action={() => handleSubmit()}>
      <div className="border-b border-gray-900/10 pb-6">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
          <Input
            {...register("sku")}
            type="text"
            id="sku"
            label="SKU da base"
            autoComplete="sku"
            placeholder="Digite o SKU da base"
            className="w-full"
            error={errors.sku?.message}
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
                keyExtractor={(d) => d.value}
                valueExtractor={(d) => d.label}
                labelExtractor={(d) => d.label}
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
                defaultValue={base.enterprise}
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
            onClick={handleCancelUpdate}
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
