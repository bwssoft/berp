"use client";

import { IProfile } from "@/app/lib/@backend/domain";
import { useChooseProfileForm } from "./use-choose.profile.form";
import { Combobox } from "@bwsoft/combobox";

interface Props {
  profile: IProfile | null;
}
export function ChooseProfileForm(props: Props) {
  const { profile } = props;
  const { query, handleChangeProfile, handleSearchProfile } =
    useChooseProfileForm();

  return (
    <form className="w-full">
      <div className="border border-gray-900/10 p-4 rounded-lg shadow-md bg-white">
        <div className="sm:w-96">
          <label
            htmlFor="username"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Perfil
          </label>
          <div className="mt-2">
            <Combobox
              data={query.data ?? []}
              displayValueGetter={(doc) => doc.name}
              keyExtractor={(doc) => doc.id}
              onOptionChange={([doc]) => handleChangeProfile(doc?.id)}
              type="single"
              onSearchChange={handleSearchProfile}
              defaultValue={profile ? [profile] : []}
              placeholder="Escolha o perfil"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
