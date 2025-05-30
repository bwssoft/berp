"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Button, Input } from "../../../../component";
import { text } from "stream/consumers";
import { SetStateAction } from "react";

interface Props {
  onValidate: (
    documentValue: string
  ) => "cpf" | "cnpj" | "invalid" | Promise<"cpf" | "cnpj" | "invalid">;
  toggleButtonText: (
    key: "contact" | "controlled" | "holding",
    type: "Validar" | "Editar"
  ) => void;
  type: "cpf" | "cnpj" | undefined;
  textButton: {
    holding: string;
    controlled: string;
    contact: string;
  };
}

export function DocumentAccountForm({
  onValidate,
  type,
  textButton,
  toggleButtonText,
}: Props) {
  const methods = useFormContext<CreateAccountFormSchema>();

  return (
    <div>
      <div className="flex items-end gap-4">
        <Input
          {...methods.register("document.value")}
          label="CPF/CNPJ *"
          className="w-80"
          disabled={textButton.contact !== "Validar"}
          placeholder="Insira um documento para ser validado"
          error={methods.formState.errors.document?.value?.message}
        />
        <Button
          type="button"
          onClick={async () => {
            if (textButton.contact === "Validar") {
              const result = await onValidate(
                methods.getValues("document.value")
              );
              if (type !== undefined && result !== "invalid") {
                toggleButtonText("contact", "Editar");
              }
            } else {
              toggleButtonText("contact", "Validar");
            }
          }}
        >
          {textButton.contact}
        </Button>
      </div>

      {type && (
        <Controller
          name="document.type"
          control={methods.control}
          render={() => (
            <Input
              disabled
              value={type === "cpf" ? "Pessoa física" : "Pessoa jurídica"}
              label="Tipo de pessoa"
            />
          )}
        />
      )}
    </div>
  );
}
