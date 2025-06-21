"use client";

import { Controller, useForm } from "react-hook-form";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Select } from "../../../../component";
import { useSectorModal } from "../../../../modal/comercial/sector";

type FilterFormData = {
  client?: string;
  document?: string;
  sector?: string;
  billingStatus?: string;
  billingSituation?: string;
};

export function AccountFilterForm() {
  const { register, control, handleSubmit, reset } = useForm<FilterFormData>();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();
  const sectorModal = useSectorModal();

  function onSubmit(data: FilterFormData) {
    const params = new URLSearchParams(searchParams.toString());

    if (data.client) {
      params.set("client", data.client);
    } else {
      params.delete("client");
    }

    if (data.document) {
      params.set("document", data.document);
    } else {
      params.delete("document");
    }

    if (data.sector) {
      params.set("sector", data.sector);
    } else {
      params.delete("sector");
    }

    if (data.billingStatus && data.billingStatus !== "Todos") {
      params.set("billingStatus", data.billingStatus);
    } else {
      params.delete("billingStatus");
    }

    if (data.billingSituation && data.billingSituation !== "Todos") {
      params.set("billingSituation", data.billingSituation);
    } else {
      params.delete("billingSituation");
    }

    params.delete("page");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  function handleClear() {
    reset();
    const params = new URLSearchParams();
    startTransition(() => {
      router.push("?");
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border p-4 rounded shadow-sm space-y-4"
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
        <Input
          placeholder="Digite o CPF ou CNPJ"
          label="CPF/CNPJ"
          {...register("document")}
        />

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
              value={sectorModal.sectors.find((d) => d.name === field.value)}
              onChange={(d) => field.onChange(d.name)}
            />
          )}
        />

        <Controller
          control={control}
          name="billingStatus"
          render={({ field }) => (
            <Select
              name="billingStatus"
              data={["Ativo", "Inativo"]}
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
              data={["Adimplente", "Inadimplente", "Inadimplente/Bloqueado’"]}
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
        <Button
          type="button"
          variant={"outline"}
          onClick={handleClear}
          disabled={isPending}
        >
          Limpar
        </Button>
        <Button type="submit" variant={"default"} disabled={isPending}>
          {isPending ? "Buscando..." : "Pesquisar"}
        </Button>
      </div>
    </form>
  );
}
