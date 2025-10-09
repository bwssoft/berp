"use client";

import {IUser} from "@/backend/domain/admin/entity/user.definition";
import { Checkbox } from '@/frontend/ui/component/checkbox';
import { Combobox } from '@/frontend/ui/component/combobox/index';
import { FileUpload } from '@/frontend/ui/component/input-file';
import { Input } from '@/frontend/ui/component/input';

import { useViewOneUserForm } from "./use-view-one.user.form";

type Props = {
  user: IUser;
};

export function ViewOneUserForm({ user }: Props) {
  const {
    handleChangeProfile,
    profile,
    avatarUrl,
    handleFileUpload,
    handleSubmit,
  } = useViewOneUserForm(user);

  return (
    <form className="w-full bg-white px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset ring-gray-900/10">
      <div className="border-b border-gray-900/10 pb-6">
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox disabled label="Usuário Externo" checked={user.external} />

          <div className="col-span-full">
            <Combobox
              data={user.profile}
              displayValueGetter={(doc) => doc.name}
              keyExtractor={(doc) => doc.id}
              onOptionChange={([doc]) => doc?.id && handleChangeProfile(doc.id)}
              type="single"
              label="Perfil"
              defaultValue={
                profile ? [{ id: profile.id, name: profile.name }] : undefined
              }
              placeholder="Escolha seu perfil atual"
              modal={false}
            />
          </div>
          <Input label="CPF" value={user.cpf} disabled />
          <Input label="Nome completo" value={user.name} disabled />
          <Input label="Email" value={user.email} disabled />
          <Input label="Usuário" value={user.username} disabled />
          <FileUpload
            label="Imagem de perfil"
            handleFile={handleFileUpload}
            multiple={false}
            accept={"jpeg, jpg, png"}
            currentImageUrl={avatarUrl}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-6 justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          Salvar
        </button>
      </div>
    </form>
  );
}

