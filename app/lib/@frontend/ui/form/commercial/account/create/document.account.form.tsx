"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Button, Input } from "../../../../component";
import { useState } from "react";
import { maskCpfCnpj } from "@/app/lib/util/format-mask-cpf-cnpj";

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
  const [isValidating, setIsValidating] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-4">
        <Controller
          name="document.value"
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              onChange={(e) => {
                const maskedValue = maskCpfCnpj(e.target.value);
                field.onChange(maskedValue);
              }}
              required
              label="CPF/CNPJ"
              disabled={textButton.contact !== "Validar" || isValidating}
              placeholder="Insira um documento para ser validado"
              error={methods.formState.errors.document?.value?.message}
            />
          )}
        />
        <Button
          type="button"
          disabled={isValidating}
          onClick={async () => {
            if (textButton.contact === "Validar") {
              setIsValidating(true);
              try {
                const result = await onValidate(
                  methods.getValues("document.value")
                );
                if (type !== undefined && result !== "invalid") {
                  toggleButtonText("contact", "Editar");
                }
              } finally {
                setIsValidating(false);
              }
            } else {
              toggleButtonText("contact", "Validar");
            }
          }}
        >
          {isValidating ? "Validando..." : textButton.contact}
        </Button>
      </div>

      {type && (
        <Controller
          name="document.type"
          control={methods.control}
          render={() => (
            <Input
              disabled
              required
              value={type === "cpf" ? "Pessoa física" : "Pessoa jurídica"}
              label="Tipo de pessoa"
            />
          )}
        />
      )}
    </div>
  );
}
