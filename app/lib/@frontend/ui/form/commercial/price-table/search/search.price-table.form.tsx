"use client";

import { Button } from "@/app/lib/@frontend/ui/component";
import { CalendarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";

export function PriceTableFilterForm() {
  const { handleParamsChange } = useHandleParamsChange();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters = Object.fromEntries(formData.entries());
    handleParamsChange(filters);
  };

  const handleClear = () => {
    // Clear all form fields
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.reset();
    }
    // Clear URL params
    handleParamsChange({});
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
            Data de cadastro
          </label>
          <div className="relative">
            <input
              type="date"
              name="created_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
            />
            <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de ativação
          </label>
          <div className="relative">
            <input
              type="date"
              name="start_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
            />
            <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data final
          </label>
          <div className="relative">
            <input
              type="date"
              name="end_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
            />
            <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
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
