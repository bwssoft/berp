"use client";

import { ITechnology } from "@/app/lib/@backend/domain";
import { useTechnologySearchForm } from "./use-technology-search-form";
import { Combobox } from "@bwsoft/combobox";

interface Props {
  technology: ITechnology | null;
}
export function TechnologySearchForm(props: Props) {
  const { technology } = props;
  const { technologyQuery, handleChangeTechnology, handleSearchTechnology } =
    useTechnologySearchForm();

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
                  data={
                    technologyQuery.data?.filter(
                      (el) => el.name.system !== "DM_E3_PLUS"
                    ) ?? []
                  }
                  displayValueGetter={(doc) => doc.name.brand}
                  keyExtractor={(doc) => doc.id}
                  onOptionChange={([doc]) => handleChangeTechnology(doc?.id)}
                  type="single"
                  onSearchChange={handleSearchTechnology}
                  defaultValue={technology ? [technology] : []}
                  placeholder="Escolha a tecnologia"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
