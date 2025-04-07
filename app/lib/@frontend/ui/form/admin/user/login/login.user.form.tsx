"use client";

import { Button, Input } from "../../../../component";
import { useLoginUserForm } from "./use-login.user.form";

export function LoginUserForm() {
  const { handleSubmit, register, errors } = useLoginUserForm();

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Usuário"
          type="text"
          {...register("username")}
          error={errors.username?.message}
        />

        <Input
          label="Senha"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
        >
          Esqueci minha senha
        </button>
      </div>

      <div className="flex items-center justify-end gap-x-4">
        <Button type="button" variant="ghost">
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
}
