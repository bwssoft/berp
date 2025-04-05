"use client";

import { useAutoTestLogSearchForm } from "./use-auto-test-log-search-form";
import { Input } from "../../../../component";

export function AutoTestLogSearchForm() {
  const { handleQuickSearch } = useAutoTestLogSearchForm();

  return (
    <form>
      <div>
        <div className="border-b border-gray-900/10 pb-6">
          <Input
            onChange={handleQuickSearch}
            label="Pesquisar registros de auto teste"
            placeholder="Busque pelo equipamento, cliente, usuário tecnologia."
            className="sm:w-96"
          />
        </div>
      </div>
    </form>
  );
}
