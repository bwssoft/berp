"use client";

import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  DateInput,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/lib/@frontend/ui/component";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type FilterFormData = {
  name?: string;
  type?: string;
  status?: string;
  created_date?: Date | null;
  activation_date?: Date | null;
  activation_period?: { from: Date; to: Date } | null;
};

const DEFAULTS: FilterFormData = {
  name: "",
  type: "Todos",
  status: "Todos",
  created_date: null,
  activation_date: null,
  activation_period: null,
};

export function PriceTableFilterForm() {
  const form = useForm<FilterFormData>({ defaultValues: DEFAULTS });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(data: FilterFormData) {
    const params = new URLSearchParams(searchParams.toString());

    data.name ? params.set("name", data.name) : params.delete("name");
    data.type && data.type !== "Todos"
      ? params.set("type", data.type)
      : params.delete("type");
    data.status && data.status !== "Todos"
      ? params.set("status", data.status)
      : params.delete("status");

    if (data.created_date) {
      params.set("created_date", data.created_date.toISOString().split("T")[0]);
    } else {
      params.delete("created_date");
    }

    if (data.activation_date) {
      params.set(
        "activation_date",
        data.activation_date.toISOString().split("T")[0]
      );
    } else {
      params.delete("activation_date");
    }

    if (data.activation_period?.from) {
      params.set(
        "start_date",
        data.activation_period.from.toISOString().split("T")[0]
      );
    } else {
      params.delete("start_date");
    }

    if (data.activation_period?.to) {
      params.set(
        "end_date",
        data.activation_period.to.toISOString().split("T")[0]
      );
    } else {
      params.delete("end_date");
    }

    params.delete("page");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  function handleClear() {
    form.reset(DEFAULTS);
    startTransition(() => {
      router.push("?");
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da tabela
          </label>
          <Input
            {...form.register("name")}
            placeholder="Digite a Razão Social ou Nome Fantasia"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de tabela
          </label>
          <Select
            onValueChange={(v) => form.setValue("type", v)}
            value={form.watch("type") ?? "Todos"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Provisória">Provisória</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status da tabela
          </label>
          <Select
            onValueChange={(v) => form.setValue("status", v)}
            value={form.watch("status") ?? "Todos"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="ACTIVE">Ativa</SelectItem>
              <SelectItem value="INACTIVE">Inativa</SelectItem>
              <SelectItem value="DRAFT">Rascunho</SelectItem>
              <SelectItem value="Em Pausa">Em Pausa</SelectItem>
              <SelectItem value="CANCELLED">Cancelada</SelectItem>
              <SelectItem value="AWAITING_PUBLICATION">
                Aguardando Publicação
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de criação
          </label>
          <DateInput
            type="date"
            value={form.watch("created_date")}
            onChange={(value) =>
              form.setValue("created_date", value as Date | null)
            }
            placeholder="Selecione a data de criação"
            name="created_date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de ativação
          </label>
          <DateInput
            type="date"
            value={form.watch("activation_date")}
            onChange={(value) =>
              form.setValue("activation_date", value as Date | null)
            }
            placeholder="Selecione a data de ativação"
            name="activation_date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período de ativação
          </label>
          <DateInput
            type="period"
            value={form.watch("activation_period")}
            onChange={(value) =>
              form.setValue(
                "activation_period",
                value as { from: Date; to: Date } | null
              )
            }
            placeholder="Selecione o período de ativação"
            name="activation_period"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="border-gray-300"
          onClick={handleClear}
          disabled={isPending}
        >
          <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
          Limpar
        </Button>
        <Button type="submit" disabled={isPending}>
          <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
          {isPending ? "Buscando..." : "Pesquisar"}
        </Button>
      </div>
    </form>
  );
}
