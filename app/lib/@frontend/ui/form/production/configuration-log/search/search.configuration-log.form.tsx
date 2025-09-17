"use client";

import { useConfigurationLogSearchForm } from "./use-search.configuration-log.form";
import { Button, Input } from "../../../../component";
import { Filter } from "mongodb";
import { IConfigurationLog } from "@/app/lib/@backend/domain";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { LoaderIcon, SearchIcon } from "lucide-react";
import { DateRangeInput } from "../../../../component/date-range-input";
import { Controller } from "react-hook-form";

interface Props {
  filter: Filter<IConfigurationLog>;
}
export function ConfigurationLogSearchForm(props: Props) {
  const { filter } = props;
  const { searchForm, handleSubmit, handleExport, isPending } =
    useConfigurationLogSearchForm();

  return (
    <div className="w-full flex justify-between items-end pt-3">
      <form
        onSubmit={handleSubmit}
        className="flex items-center !justify-normal w-full gap-2"
      >
        <Input
          {...searchForm.register("query")}
          placeholder="Serial ou nome do usuário"
          containerClassname="w-60"
        />

        <Controller
          control={searchForm.control}
          name="created_at"
          render={({ field }) => (
            <DateRangeInput
              value={{
                from: field.value?.from
                  ? new Date(field.value?.from)
                  : undefined,
                to: field.value?.to ? new Date(field.value?.to) : undefined,
              }}
              showTimeInputs
              onChange={(date) => {
                const { from, to } = date;
                field.onChange({
                  from,
                  to,
                });
              }}
            />
          )}
        />

        <Button
          disabled={isPending}
          type="submit"
          size="icon"
          variant="outline"
        >
          {isPending ? (
            <LoaderIcon className="animate-spin" size={12} />
          ) : (
            <SearchIcon size={12} />
          )}
        </Button>
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
