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
            label="Pesquise por um registro"
            placeholder="Busque por qualquer dado do registro."
            className="sm:w-96"
          />
        </div>
      </div>
    </form>
  );
}
