import { Button, Checkbox, Input } from "../../../../component";
import { Combobox } from "@bwsoft/combobox";
import { Controller } from "react-hook-form";


import { IUser } from "@/app/lib/@backend/domain";
import { useUpdateOneUserForm } from "./use-update-one-user-form";
import { ActiveUserDialog, LockUserDialog, ResetPasswordUserDialog, useActiveUserDialog, useLockUserDialog, useResetPasswordUserDialog } from "../../../../dialog";


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
    isLoadingUser,
    handleSubmit,
    handleCancelEdit,
  } = useUpdateOneUserForm(user);

  const lockDialog = useLockUserDialog({
    userId: userData.id,
    willLock: !userData.lock,
  });

  const activeDialog = useActiveUserDialog({
    userId: userData.id,
    willActivate: !userData.active,
  });

  const resetPasswordDialog = useResetPasswordUserDialog({
    userId: userData.id,
  });

  if (isLoadingUser) return <div>Carregando dados do usuário…</div>;

  const isLocked = userData.lock;
  const isActive = userData.active;

  return (
    <>
      <h1 className="text-xl font-bold mb-4">
        Edição de Usuário – {userData.name ?? ""}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
          <Button variant="secondary" onClick={lockDialog.openDialog}>
            {isLocked ? "Desbloquear Usuário" : "Bloquear Usuário"}
          </Button>

          <Button variant="secondary" onClick={resetPasswordDialog.openDialog} disabled={isLocked}>
            Reset de Senha
          </Button>

          <Button variant="secondary" onClick={activeDialog.openDialog}>
            {isActive ? "Inativar" : "Ativar"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  label="Usuário Externo"
                  disabled={isLocked}
                />
              )}
            />
          </div>

          <Input
            label="CPF"
            {...register("cpf")}
            error={errors.cpf?.message}
            disabled={isLocked}
          />

          <Input
            label="Nome Completo"
            {...register("name")}
            error={errors.name?.message}
            disabled={isLocked}
          />

          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            disabled={isLocked}
          />

          <Input
            label="Usuário"
            {...register("username")}
            error={errors.username?.message}
            disabled={isLocked}
          />

          <Controller
            control={control}
            name="profile_id"
            render={({ field }) => (
              <Combobox
                label="Perfis"
                className="mt-2"
                type="multiple"
                data={profiles ?? []}
                error={errors.profile_id?.message}
                onOptionChange={(items) => {
                  field.onChange(items.map((item) => item.id));
                }}
                keyExtractor={(item) => item.id}
                displayValueGetter={(item) => item.name}
                disabled={isLocked}
              />
            )}
          />
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button variant="secondary" onClick={handleCancelEdit}>
            Voltar
          </Button>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Cancelar
          </Button>
          <Button variant="default">Salvar</Button>
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
