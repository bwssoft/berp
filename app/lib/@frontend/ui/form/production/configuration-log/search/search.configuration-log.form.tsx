"use client";

import { useConfigurationLogSearchForm } from "./use-search.configuration-log.form";
import { Button, Input } from "../../../../component";
import { Filter } from "mongodb";
import { IConfigurationLog } from "@/app/lib/@backend/domain";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface Props {
  filter: Filter<IConfigurationLog>;
}
export function ConfigurationLogSearchForm(props: Props) {
  const { filter } = props;
  const { handleQuickSearch, handleExport } = useConfigurationLogSearchForm();

  return (
    <div className="w-full flex justify-between items-end">
      <form>
        <Input
          onChange={handleQuickSearch}
          label="Pesquisar registros de configuração"
          placeholder="Busque pelo equipamento, cliente, usuário, tecnologia e perfil."
          className="sm:w-96"
        />
      </form>
      <Button
        variant="outline"
        type="button"
        title="Exporte os dados filtrados"
        onClick={() => handleExport(filter)}
      >
        <ArrowDownTrayIcon className="size-5" /> Exportar
      </Button>
    </div>
  );
}
