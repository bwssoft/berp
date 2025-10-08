"use client";

import {
  IConfigurationLog,
  IConfigurationProfile,
  ITechnology,
} from "@/app/lib/@backend/domain";
import { useTechnologyAndConfigurationProfileForm } from "./use-technology-and-configuration-profile-search";
import { Combobox } from '@/frontend/ui/component/combobox/index';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/ui/component/select';

import { Label } from "../../../component/label";
import { Controller } from "react-hook-form";
import { Loader2Icon, LoaderIcon } from "lucide-react";

interface Props {
  configurationLog?: IConfigurationLog[] | null;
  configurationProfile?: IConfigurationProfile | null;
  technology?: ITechnology | null;
}
export function TechnologyAndConfigurationProfileSearchForm(props: Props) {
  const { configurationProfile, technology, configurationLog } = props;
  const {
    form,
    configurationProfileQuery,
    technologyQuery,
    handleSearchConfigurationProfile,
    handleChangeTechnology,
    handleChangeConfigurationProfile,
  } = useTechnologyAndConfigurationProfileForm({
    configurationProfile,
    configurationLog,
  });

  return (
    <form>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <Label className="block text-sm/6 font-medium text-gray-900">
            Tecnologia
          </Label>
          <div className="mt-2">
            <Select
              onValueChange={(id) => handleChangeTechnology(id)}
              defaultValue={technology?.id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo de dispositivo" />
              </SelectTrigger>
              <SelectContent>
                {technologyQuery.isFetching && (
                  <div className="h-20 flex flex-col text-xs items-center justify-center text-muted-foreground">
                    <LoaderIcon
                      className="animate-spin right-3 text-muted-foreground"
                      size={10}
                    />
                    <span>Buscando tecnologias disponiveis</span>
                  </div>
                )}

                {(technologyQuery.data ?? []).map((input) => (
                  <SelectItem key={input.id} value={input.id}>
                    {input.name.brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="sm:col-span-4">
          <label className="block text-sm/6 font-medium text-gray-900">
            Perfil de configuração
          </label>
          <div className="mt-2">
            <Controller
              control={form.control}
              name="profile"
              render={({ field }) => (
                <Combobox
                  data={configurationProfileQuery.data ?? []}
                  displayValueGetter={(doc) => doc.name}
                  keyExtractor={(doc) => doc.id}
                  type="single"
                  value={field.value}
                  onSearchChange={handleSearchConfigurationProfile}
                  onOptionChange={(doc) =>
                    handleChangeConfigurationProfile(doc)
                  }
                  placeholder="Escolha o perfil de configuração"
                  modal={false}
                />
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
