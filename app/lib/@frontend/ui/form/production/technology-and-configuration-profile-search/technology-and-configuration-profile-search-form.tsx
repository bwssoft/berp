"use client";

import { IConfigurationProfile, ITechnology } from "@/app/lib/@backend/domain";
import { useTechnologyAndConfigurationProfileForm } from "./use-technology-and-configuration-profile-search";
import {
  Combobox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../component";
import { Label } from "../../../component/label";

interface Props {
  configurationProfile: IConfigurationProfile | null;
  technology: ITechnology | null;
}
export function TechnologyAndConfigurationProfileSearchForm(props: Props) {
  const { configurationProfile, technology } = props;
  const {
    configurationProfileQuery,
    technologyQuery,
    handleSearchConfigurationProfile,
    handleChangeTechnology,
    handleChangeConfigurationProfile,
  } = useTechnologyAndConfigurationProfileForm();

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
            <Combobox
              data={configurationProfileQuery.data ?? []}
              displayValueGetter={(doc) => doc.name}
              keyExtractor={(doc) => doc.id}
              type="single"
              onSearchChange={handleSearchConfigurationProfile}
              onOptionChange={([doc]) =>
                handleChangeConfigurationProfile(doc?.id)
              }
              defaultValue={configurationProfile ? [configurationProfile] : []}
              placeholder="Escolha o perfil de configuração"
              modal={false}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
