"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  CreateAccountFormSchema,
  useCreateAccountForm,
} from "./use-create.account.form";
import { Button, Input } from "../../../../component";

export function DocumentAccountForm() {
  const methods = useFormContext<CreateAccountFormSchema>();
  const { handleCpfCnpj, type } = useCreateAccountForm();

  return (
    <div>
      <div className="flex items-end gap-4">
        <Input
          {...methods.register("document.value")}
          label="CPF/CNPJ *"
          className="w-80"
          placeholder="Insira um documento para ser validado"
          error={methods.formState.errors.document?.value?.message}
        />
        <Button
          type="button"
          onClick={() => handleCpfCnpj(methods.getValues("document.value"))}
        >
          Validar
        </Button>
      </div>
      <Controller
        name={"document.type"}
        control={methods.control}
        render={({ field }) => (
          <Input
            value={type === "cpf" ? "Pessoa fisica" : "Pessoa juridica"}
            label="Tipo de pessoa"
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
