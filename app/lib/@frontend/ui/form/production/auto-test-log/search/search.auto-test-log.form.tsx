"use client";

import { useAutoTestLogSearchForm } from "./use-search.auto-test-log.form";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';

import { Filter } from "mongodb";
import {IAutoTestLog} from "@/app/lib/@backend/domain/production/entity/auto-test-log.definition";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface Props {
  filter: Filter<IAutoTestLog>;
}
export function AutoTestLogSearchForm(props: Props) {
  const { filter } = props;
  const { handleQuickSearch, handleExport } = useAutoTestLogSearchForm();

  return (
    <div className="w-full flex justify-between items-end">
      <form>
        <Input
          onChange={handleQuickSearch}
          label="Pesquisar registros de auto teste"
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
