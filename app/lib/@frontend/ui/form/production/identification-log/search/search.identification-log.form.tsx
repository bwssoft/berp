"use client";

import { useIdentificationLogSearchForm } from "./use-search-identification-form";
import { Input } from "../../../../component";

export function IdentificationLogSearchForm() {
  const { handleQuickSearch } = useIdentificationLogSearchForm();

  return (
    <form>
      <div>
        <div className="border-b border-gray-900/10 pb-6">
          <Input
            onChange={handleQuickSearch}
            label="Pesquisar registros de identificação"
            placeholder="Busque pelo equipamento, cliente, usuário tecnologia."
            className="sm:w-96"
          />
        </div>
      </div>
    </form>
  );
}
