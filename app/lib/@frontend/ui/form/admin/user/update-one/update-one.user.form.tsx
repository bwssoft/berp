"use client";

import {
  Button,
  Checkbox,
  Input,
  Combobox,
  FileUpload,
} from "../../../../component";
import { Controller } from "react-hook-form";
import { IUser } from "@/app/lib/@backend/domain";
import { useUpdateOneUserForm } from "./use-update-one-user-form";
import {
  ActiveUserDialog,
  LockUserDialog,
  ResetPasswordUserDialog,
  useActiveUserDialog,
  useLockUserDialog,
  useResetPasswordUserDialog,
} from "../../../../dialog";
import { useAuth } from "@/app/lib/@frontend/context";
import { useEffect, useState } from "react";
import { getUserAvatarUrlByKey } from "@/app/lib/@backend/action/admin/user.action";

interface Props {
  user: IUser;
}

export function UpdateOneUserForm({ user }: Props) {
  const {
    register,
    control,
    errors,
    profiles,
    userData,
    handleSubmit,
    handleBackPage,
    setSearchTerm,
  } = useUpdateOneUserForm(user);
  const { restrictFeatureByProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchAvatarUrl() {
      if (userData.id && userData.image?.key) {
        const url = await getUserAvatarUrlByKey(userData.id, userData.image.key);
        setAvatarUrl(url);
      }
    }
    fetchAvatarUrl();
  }, [userData.id, userData.image?.key, getUserAvatarUrlByKey]);
    

  const lockDialog = useLockUserDialog({
    userId: userData.id,
    willLock: !userData.lock,
  });

  const activeDialog = useActiveUserDialog({
    userId: userData.id,
    willActivate: !userData.active,
  });

  const canUpdate = restrictFeatureByProfile("admin:user:update");

  const resetPasswordDialog = useResetPasswordUserDialog({
    userId: userData.id,
  });

  const isLocked = userData.lock;
  const isActive = userData.active;

  return (
    <>
      <form
        action={() => handleSubmit()}
        className="bg-white px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset w-full ring-gray-900/10"
      >
        <div className="border-b border-gray-900/10 pb-6">
          <div className="mt-10 flex gap-2 justify-end">
            {canUpdate && (
              <>
                <Button
                  variant="secondary"
                  onClick={lockDialog.openDialog}
                  type="button"
                  disabled={!isActive}
                >
                  {isLocked ? "Desbloquear Usuário" : "Bloquear Usuário"}
                </Button>

                <Button
                  variant="secondary"
                  onClick={resetPasswordDialog.openDialog}
                  disabled={isLocked || !isActive}
                  type="button"
                >
                  Reset de Senha
                </Button>
                <Button
                  variant="secondary"
                  onClick={activeDialog.openDialog}
                  type="button"
                >
                  {isActive ? "Inativar" : "Ativar"}
                </Button>
              </>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-4">
              <Controller
                control={control}
                name="external"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={!isActive}
                    name={field.name}
                    label="Usuário externo"
                  />
                )}
              />

              <Controller
                control={control}
                name="profile"
                render={({ field }) => (
                  <Combobox
                    label="Perfis"
                    type="multiple"
                    placeholder="Selecione os perfis desse usuário"
                    className="mt-1 text-left"
                    data={profiles ?? []}
                    behavior="search"
                    onSearchChange={setSearchTerm}
                    error={errors.profile?.message}
                    onOptionChange={field.onChange}
                    value={field.value}
                    keyExtractor={(item) => item.id}
                    displayValueGetter={(item) => item.name}
                    disabled={!isActive}
                  />
                )}
              />
            </div>

            <Input
              label="CPF"
              {...register("cpf")}
              error={errors.cpf?.message}
              disabled={ !isActive}
              placeholder="Digite o CPF"
            />

            <Input
              label="Nome Completo"
              {...register("name")}
              error={errors.name?.message}
              disabled={ !isActive}
              placeholder="Digite o nome completo"
            />

            <Input
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              disabled={ !isActive}
              placeholder="Digite o Email"
            />

            <Input
              label="Usuário"
              {...register("username")}
              error={errors.username?.message}
              disabled={ !isActive}
              placeholder="Digite o nome de Usuário"
            />
          </div>
          <div className="mt-6">
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <FileUpload
                  disabled={ !isActive}
                  label="Imagem de perfil"
                  handleFile={field.onChange}
                  multiple={false}
                  accept={"jpeg, jpg, png"}
                  currentImageUrl={avatarUrl}
                />
              )}
            />
          </div>
        </div>

        <div className="flex gap-2  mt-6 justify-end">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleBackPage} type="button">
              Cancelar
            </Button>
            <Button type="submit" variant="default" disabled={!isActive}>
              Salvar
            </Button>
          </div>
        </div>
      </form>

      <LockUserDialog
        open={lockDialog.open}
        setOpen={lockDialog.setOpen}
        confirm={lockDialog.confirm}
        isLoading={lockDialog.isLoading}
        willLock={!isLocked}
      />

      <ActiveUserDialog
        open={activeDialog.open}
        setOpen={activeDialog.setOpen}
        confirm={activeDialog.confirm}
        isLoading={activeDialog.isLoading}
        willActivate={!isActive}
      />

      <ResetPasswordUserDialog
        open={resetPasswordDialog.open}
        setOpen={resetPasswordDialog.setOpen}
        confirm={resetPasswordDialog.confirm}
        isLoading={resetPasswordDialog.isLoading}
      />
    </>
  );
}
