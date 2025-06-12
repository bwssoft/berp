"use client";

import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { format, subMonths } from "date-fns";
import { Button, Input, Select } from "../../../../component";
import { useSectorModal } from "../../../../modal/comercial/sector";

type FilterFormData = {
  client?: string;
  document?: string;
  sector?: string;
  billingStatus?: string;
  billingSituation?: string;
};

const statuses = ["Todos", "Ativo", "Inativo"] as const;
const situations = ["Todos", "Regular", "Irregular"] as const;

export function AccountFilterForm() {
  const { register, control, handleSubmit, reset } = useForm<FilterFormData>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const sectorModal = useSectorModal();

  function handleMonthChange(delta: number) {
    setSelectedDate((prev) => subMonths(prev, delta));
  }

  function onSubmit(data: FilterFormData) {
    console.log("Filtrar com:", {
      ...data,
      lastBillingUntil: selectedDate,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border p-4 rounded shadow-sm space-y-4"
    >
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Conta</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Input
          label="Cliente"
          placeholder="Digite a Razão Social ou Nome Fantasia"
          {...register("client")}
        />
        <Input label="CPF/CNPJ" {...register("document")} />

        <Controller
          control={control}
          name="sector"
          render={({ field }) => (
            <Select
              name="sector"
              data={sectorModal.sectors}
              keyExtractor={(d) => d.id!}
              valueExtractor={(d) => d.name}
              label="Setor"
              value={sectorModal.sectors.find((d) => d.id === field.value)}
              onChange={(d) => field.onChange(d.id)}
            />
          )}
        />

        <div>
          <label className="block text-sm font-medium">
            Último Faturamento até
          </label>
          <div className="flex items-center border rounded px-2 py-1">
            <button
              type="button"
              onClick={() => handleMonthChange(1)}
              className="px-2 text-gray-500"
            >
              &lt;
            </button>
            <span className="flex-1 text-center">
              {format(selectedDate, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={() => handleMonthChange(-1)}
              className="px-2 text-gray-500"
            >
              &gt;
            </button>
          </div>
        </div>

        <Controller
          control={control}
          name="billingStatus"
          render={({ field }) => (
            <Select
              name="billingStatus"
              data={statuses}
              keyExtractor={(s) => s}
              valueExtractor={(s) => s}
              label="Status Faturamento"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="billingSituation"
          render={({ field }) => (
            <Select
              name="billingSituation"
              data={situations}
              keyExtractor={(s) => s}
              valueExtractor={(s) => s}
              label="Situação Faturamento"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant={"outline"} onClick={() => reset()}>
          Limpar
        </Button>
        <Button type="submit" variant={"default"}>
          Pesquisar
        </Button>
      </div>
    </form>
  );
}
