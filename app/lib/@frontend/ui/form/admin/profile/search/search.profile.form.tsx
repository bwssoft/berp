"use client";

import { useSearchProfileForm } from "./use-search.profile.form";
import { Button, Input } from "../../../../component";
import { FunnelIcon } from "@heroicons/react/24/outline";

export function SearchProfileForm() {
  const { handleChangeProfileName } = useSearchProfileForm();

  return (
    <form className="w-full">
      <div className="border border-gray-900/10 p-4 rounded-lg shadow-md bg-white">
        <div className="flex gap-2 items-end">
          <Input
            label="Perfil"
            placeholder="Digite e busque pelo nome do perfil"
            containerClassname="sm:w-96"
            onChange={handleChangeProfileName}
          />
          <Button
            type="button"
            variant={"outline"}
            className="rounded-full w-fit px-2 py-1 ring-gray-300"
            title="Abrir modal com filto detalhado"
          >
            <FunnelIcon className="size-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}
