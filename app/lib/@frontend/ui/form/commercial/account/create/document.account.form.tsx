"use client";

import { useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Button, Input } from "../../../../component";

export function DocumentAccountForm() {
  const methods = useFormContext<CreateAccountFormSchema>();
  return (
    <div>
      <div className="flex items-end gap-4">
        <Input
          {...methods.register("document.value")}
          label="CPF/CNPJ *"
          className="w-80"
          placeholder="Insira um documento para ser validado"
        />
        <Button type="button">Validar</Button>
      </div>
      <Input label="Tipo de pessoa" {...methods.register("document.type")} />
    </div>
  );
}
