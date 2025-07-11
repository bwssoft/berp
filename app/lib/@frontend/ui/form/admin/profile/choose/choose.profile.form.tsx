"use client";

import { IProfile } from "@/app/lib/@backend/domain";
import { useChooseProfileForm } from "./use-choose.profile.form";
import { Combobox } from "../../../../component";

interface Props {
  profile: IProfile | null;
}
export function ChooseProfileForm(props: Props) {
  const { profile } = props;
  const { query, handleChangeProfile, handleSearchProfile } =
    useChooseProfileForm();

  return (
    <form className="w-full">
      <div className="ring-1 ring-inset ring-gray-900/10 rounded-md shadow-sm bg-white py-2 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8">
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
              placeholder="Escolha uma opção"
              modal={false}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
