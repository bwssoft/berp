"use client";

import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';

import { useRequestNewPasswordUserForm } from "./use-request-new-password.user.form";

export function RequestNewPasswordUserForm() {
  const { handleSubmit, register, errors } = useRequestNewPasswordUserForm();

  return (
    <form action={() => handleSubmit()}>
      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Email"
          type="text"
          {...register("email")}
          error={errors.email?.message}
          placeholder="Insira o e-mail do seu usuário"
        />
      </div>

      <Button type="submit" className="mt-6">
        Requisitar nova senha
      </Button>
    </form>
  );
}
