"use client";

import { useConfigurationLogSearchForm } from "./use-search.configuration-log.form";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';
import { Label } from '@/frontend/ui/component/label';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@/frontend/ui/component/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/ui/component/select';

import { Filter } from "mongodb";
import {IConfigurationLog} from "@/app/lib/@backend/domain/production/entity/configuration-log.definition";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import {
  FilterIcon,
  LoaderIcon,
  RefreshCcwIcon,
  SearchIcon,
} from "lucide-react";
import { DateRangeInput } from "../../../../component/date-range-input";
import { Controller } from "react-hook-form";
import { ConfiguratorPageSearchParams } from "@/app/production/log/configurator/page";
import React from "react";

interface Props {
  filter: Filter<IConfigurationLog>;
  searchParams: ConfiguratorPageSearchParams;
}

export function ConfigurationLogSearchForm({ filter, searchParams }: Props) {
  const {
    searchForm,
    handleSubmit,
    exportMutation,
    isPending,
    handleReset,
    shouldShowResetButton,
    filterDisclosure,
  } = useConfigurationLogSearchForm({ searchParams });

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex justify-between items-end pt-3"
    >
      <div className="flex items-center !justify-normal w-full gap-2">
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
          type="button"
          size="icon"
          variant="outline"
          onClick={filterDisclosure.onOpen}
        >
          <FilterIcon size={12} />
        </Button>

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

        {shouldShowResetButton && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleReset}
            disabled={isPending}
          >
            {isPending ? (
              <LoaderIcon className="animate-spin" size={12} />
            ) : (
              <RefreshCcwIcon size={12} />
            )}
          </Button>
        )}
      </div>
      <Button
        variant="outline"
        disabled={exportMutation.isPending}
        type="button"
        title="Exporte os dados filtrados"
        onClick={() => exportMutation.mutate(filter)}
      >
        {exportMutation.isPending ? (
          <React.Fragment>
            <LoaderIcon className="animate-spin" size={12} />
            Exportando dados, aguarde...
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ArrowDownTrayIcon className="size-5" /> Exportar
          </React.Fragment>
        )}
      </Button>

      <Modal
        position="center"
        open={filterDisclosure.isOpen}
        onClose={filterDisclosure.onClose}
        title="Filtros adicionais"
        className="p-0 w-[30rem]"
        classNameHeader="modal-header"
        containerClassName="modal-container"
      >
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col gap-1">
              <Input
                label="ICCID"
                {...searchForm.register("iccid")}
                containerClassname="!space-y-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Status</Label>

              <Controller
                control={searchForm.control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">Sucesso</SelectItem>
                      <SelectItem value="failed">Falha</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Perfil de configuração"
                {...searchForm.register("profile")}
                containerClassname="!space-y-0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Usuário"
                {...searchForm.register("user")}
                containerClassname="!space-y-0"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleSubmit()} disabled={isPending}>
              {isPending ? (
                <React.Fragment>
                  <LoaderIcon className="animate-spin" size={12} /> Filtrando
                </React.Fragment>
              ) : (
                <span>Filtrar</span>
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
}
