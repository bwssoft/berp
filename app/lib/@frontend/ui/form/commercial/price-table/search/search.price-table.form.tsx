"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button, DateInput } from "@/app/lib/@frontend/ui/component";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { useState } from "react";

export function PriceTableFilterForm() {
  const { handleParamsChange } = useHandleParamsChange();
  const router = useRouter();
  const pathname = usePathname();
  const [createdDate, setCreatedDate] = useState<Date | null>(null);
  const [activationDate, setActivationDate] = useState<Date | null>(null);
  const [activationPeriod, setActivationPeriod] = useState<{
    from: Date;
    to: Date;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters = Object.fromEntries(formData.entries());

    // Handle date inputs
    if (createdDate) {
      filters.created_date = createdDate.toISOString().split("T")[0];
    }
    if (activationDate) {
      filters.activation_date = activationDate.toISOString().split("T")[0];
    }
    if (activationPeriod?.from) {
      filters.start_date = activationPeriod.from.toISOString().split("T")[0];
    }
    if (activationPeriod?.to) {
      filters.end_date = activationPeriod.to.toISOString().split("T")[0];
    }

    handleParamsChange(filters);
  };

  const handleClear = () => {
    // Clear all form fields
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.reset();
    }
    // Clear date states
    setCreatedDate(null);
    setActivationDate(null);
    setActivationPeriod(null);
    // Navigate to the page without any query parameters to show all data
    router.replace(pathname);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da tabela
          </label>
          <input
            type="text"
            name="name"
            placeholder="Digite a Razão Social ou Nome Fantasia"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de tabela
          </label>
          <select
            name="type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="Normal">Normal</option>
            <option value="Provisória">Provisória</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status da tabela
          </label>
          <select
            name="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Ativa</option>
            <option value="INACTIVE">Inativa</option>
            <option value="DRAFT">Rascunho</option>
            <option value="Em Pausa">Em Pausa</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="AWAITING_PUBLICATION">Aguardando Publicação</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de criação
          </label>
          <DateInput
            type="date"
            value={createdDate}
            onChange={(value) => setCreatedDate(value as Date | null)}
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
            value={activationDate}
            onChange={(value) => setActivationDate(value as Date | null)}
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
            value={activationPeriod}
            onChange={(value) =>
              setActivationPeriod(value as { from: Date; to: Date } | null)
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
        >
          <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
          Limpar
        </Button>
        <Button type="submit">
          <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
          Pesquisar
        </Button>
      </div>
    </form>
  );
}
