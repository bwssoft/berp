"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Button, Input } from "../../../../component";

export function DocumentAccountForm() {
    const methods = useFormContext<CreateAccountFormSchema>();

    const handleCpfCnpj = () => {
        // Pega o valor atual do documento e chama a função do hook pai
        const value = methods.getValues("document.value");

        const cleanedValue = value.replace(/\D/g, "");

        if (cleanedValue.length === 11) {
            methods.setValue("document.type", "cpf", { shouldValidate: true });
        } else if (cleanedValue.length >= 14) {
            methods.setValue("document.type", "cnpj", { shouldValidate: true });
        } else {
            methods.setError("document.value", {
                type: "manual",
                message: "Documento inválido",
            });
        }
    };

    const type = methods.watch("document.type");

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
                <Button type="button" onClick={handleCpfCnpj}>
                    Validar
                </Button>
            </div>

            {type && (
                <Controller
                    name="document.type"
                    control={methods.control}
                    render={() => (
                        <Input
                            value={
                                type === "cpf"
                                    ? "Pessoa física"
                                    : "Pessoa jurídica"
                            }
                            label="Tipo de pessoa"
                            readOnly
                        />
                    )}
                />
            )}
        </div>
    );
}
