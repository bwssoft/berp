"use client";

import { Controller } from "react-hook-form";
import { useCreateAccountFormContext } from "@/app/lib/@frontend/context/create-account-form.context";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';

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
  resetType: () => void;
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
  resetType,
}: Props) {
  const { methods } = useCreateAccountFormContext();
  const [isValidating, setIsValidating] = useState(false);

  const isInValidateMode = textButton.contact === "Validar";
  const isInEditMode = textButton.contact === "Editar";

  const handleValidateDocument = async () => {
    setIsValidating(true);
    try {
      const result = await onValidate(methods.getValues("document.value"));

      if (result !== "invalid") {
        toggleButtonText("contact", "Editar");
      } else {
        resetType();
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleEditDocument = () => {
    toggleButtonText("contact", "Validar");
    resetType();
    methods.clearErrors("document.value");
  };

  const handleButtonClick = async () => {
    if (isInValidateMode) {
      await handleValidateDocument();
    } else if (isInEditMode) {
      handleEditDocument();
    }
  };

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

                methods.clearErrors("document.value");

                if (isInEditMode) {
                  resetType();
                }
              }}
              label="CPF/CNPJ *"
              disabled={!isInValidateMode || isValidating}
              placeholder="Insira um documento para ser validado"
              error={methods.formState.errors.document?.value?.message}
            />
          )}
        />
        <Button
          type="button"
          disabled={isValidating}
          onClick={handleButtonClick}
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
