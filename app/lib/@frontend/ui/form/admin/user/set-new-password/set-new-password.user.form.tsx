"use client";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "../../../../component";
import { useSetNewPasswordUserForm } from "./use-set-new-password.user.form";

export function SetNewPasswordUserForm({ userId }: { userId: string }) {
  const { register, handleSubmit, errors } = useSetNewPasswordUserForm(userId);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="Senha"
              type="password"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
          <InformationCircleIcon
            className="w-5 h-9 text-gray-500 cursor-pointer"
            title="A senha deve conter: 8-32 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo."
          />
        </div>

        <Input
          label="Confirme sua senha"
          type="password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="button" variant="ghost">
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
