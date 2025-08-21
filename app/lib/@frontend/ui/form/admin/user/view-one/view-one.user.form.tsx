"use client";

import { IUser } from "@/app/lib/@backend/domain";
import { Checkbox, Combobox, FileUpload, Input } from "../../../../component";
import { useViewOneUserForm } from "./use-view-one.user.form";
import { useAuth } from "@/app/lib/@frontend/context";
import { useEffect, useState } from "react";
import { getUserAvatarUrlByKey } from "@/app/lib/@backend/action/admin/user.action";

type Props = {
  user: IUser;
};

export function ViewOneUserForm({ user }: Props) {
  const { handleChangeProfile, profile } = useViewOneUserForm();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      if (user.id && user.image?.key) {
        const url = await getUserAvatarUrlByKey(user.id, user.image.key);
        setAvatarUrl(url);
      }
    })();
  }, []);


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
            handleFile={() => console.log}
            multiple={false}
            accept={"jpeg, jpg, png"}
            currentImageUrl={avatarUrl}
            disabled
          />
        </div>
      </div>
    </form>
  );
}
