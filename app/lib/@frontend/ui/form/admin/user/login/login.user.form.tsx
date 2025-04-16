"use client";

import Link from "next/link";
import { Button, Input } from "../../../../component";
import { useLoginUserForm } from "./use-login.user.form";

export function LoginUserForm() {
  const { handleSubmit, register, errors } = useLoginUserForm();

  return (
    <form action={() => handleSubmit()}>
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

      <div className="flex justify-end mt-6">
        <Link
          href="/forget-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>

      <div className="flex items-center justify-end gap-x-4 mt-6">
        <Button type="submit">Login</Button>
      </div>
    </form>
  );
}
