"use client";

import { useConfiguratonLogSearchForm } from "./use-configuration-log-search-form";
import { Input } from "../../../../component";

export function ConfigurationLogSearchForm() {
  const { handleQuickSearch } = useConfiguratonLogSearchForm();

  return (
    <form>
      <div>
        <div className="border-b border-gray-900/10 pb-6">
          <Input
            onChange={handleQuickSearch}
            label="Pesquisar registros de configuração"
            placeholder="Busque pelo equipamento, cliente, usuário tecnologia."
            className="sm:w-96"
          />
        </div>
      </div>
    </form>
  );
}
