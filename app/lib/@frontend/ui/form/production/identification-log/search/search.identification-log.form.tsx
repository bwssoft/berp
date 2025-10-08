"use client";

import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';

import { Filter } from "mongodb";
import { IIdentificationLog } from "@/app/lib/@backend/domain";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useIdentificationLogSearchForm } from "./use-search.identification-log.form";

interface Props {
  filter: Filter<IIdentificationLog>;
}
export function IdentificationLogSearchForm(props: Props) {
  const { filter } = props;
  const { handleQuickSearch, handleExport } = useIdentificationLogSearchForm();

  return (
    <div className="w-full flex justify-between items-end">
      <form>
        <Input
          onChange={handleQuickSearch}
          label="Pesquisar registros de identificação"
          placeholder="Busque pelo equipamento, usuário, tecnologia."
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
