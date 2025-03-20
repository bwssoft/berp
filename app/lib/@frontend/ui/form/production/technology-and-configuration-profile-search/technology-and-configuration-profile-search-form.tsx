"use client";

import { IConfigurationProfile, ITechnology } from "@/app/lib/@backend/domain";
import { useTechnologyAndConfigurationProfileForm } from "./use-technology-and-configuration-profile-search";
import { Combobox } from "@bwsoft/combobox";

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
      <div>
        <div className="border-b border-gray-900/10 pb-12">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Tecnologia
              </label>
              <div className="mt-2">
                <Combobox
                  data={technologyQuery.data ?? []}
                  displayValueGetter={(doc) => doc.name.brand}
                  keyExtractor={(doc) => doc.id}
                  onOptionChange={([doc]) => handleChangeTechnology(doc?.id)}
                  type="single"
                  defaultValue={technology ? [technology] : []}
                  placeholder="Escolha a tecnologia"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
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
                  defaultValue={
                    configurationProfile ? [configurationProfile] : []
                  }
                  placeholder="Escolha o perfil de confguração"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
