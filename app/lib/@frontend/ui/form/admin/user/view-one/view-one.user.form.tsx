"use client";

import { IUser } from "@/app/lib/@backend/domain";
import { Checkbox, Combobox, Input } from "../../../../component";
import { useViewOneUserForm } from "./use-view-one.user.form";

type Props = {
  user: IUser;
};

export function ViewOneUserForm({ user }: Props) {
  const { handleChangeProfile, profile } = useViewOneUserForm();

  return (
    <form className="bg-white px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset ring-gray-900/10">
      <div className="border-b border-gray-900/10 pb-6">
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox disabled label="Usuário Externo" checked={user.external} />

          <Input label="CPF" value={user.cpf} disabled />
          <Input label="Nome completo" value={user.name} disabled />
          <Input label="Email" value={user.email} disabled />
          <Input label="Usuário" value={user.username} disabled />
          <Combobox
            data={user.profile}
            displayValueGetter={(doc) => doc.name}
            keyExtractor={(doc) => doc.id}
            onOptionChange={([doc]) => handleChangeProfile(doc?.id)}
            type="single"
            label="Perfil"
            defaultValue={
              profile ? [{ id: profile.id, name: profile.name }] : undefined
            }
            placeholder="Escolha seu perfil atual"
          />
        </div>
      </div>
    </form>
  );
}
