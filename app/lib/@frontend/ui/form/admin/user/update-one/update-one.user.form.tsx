import { Controller } from "react-hook-form";
import { Button, Checkbox, Dialog, Input } from "../../../../component";
import { Combobox } from "@bwsoft/combobox";
import { useUpdateOneUserForm } from "./use-update-one-user-form";
import { IUser } from "@/app/lib/@backend/domain";


interface UpdateOneUserFormProps {
  user: IUser;
}

export function UpdateOneUserForm({ user }: UpdateOneUserFormProps) {
  const {
    isLoadingUser,
    register,
    control,
    errors,
    profiles,
    isDirty,
    userData,
    handleSubmit,
    handleCancelEdit,
  } = useUpdateOneUserForm(user);

  if (isLoadingUser) {
    return <div>Carregando dados do usuário...</div>;
  }

  const isLocked = userData.lock;
  const blockButtonLabel = isLocked ? "Desbloquear Usuário" : "Bloquear Usuário";

  const isActive = userData.active;
  const activeButtonLabel = isActive ? "Inativar" : "Ativar";

  const canResetPassword = !isLocked;

  return (
    <>
      <h1 className="text-xl font-bold mb-4">
        Edição de Usuário – {userData.name ?? ""}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="gap-2 flex">
          <Button variant="secondary">{blockButtonLabel}</Button>
          <Button variant="secondary" disabled={!canResetPassword}>
            Reset de Senha
          </Button>
          <Button variant="secondary">{activeButtonLabel}</Button>
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
    </>
  );
}
