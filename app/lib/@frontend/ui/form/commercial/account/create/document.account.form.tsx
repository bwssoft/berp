"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Button, Input } from "../../../../component";

interface Props {
    onValidate: (documentValue: string) => void;
    type: "cpf" | "cnpj" | undefined;
}

export function DocumentAccountForm({ onValidate, type }: Props) {
    const methods = useFormContext<CreateAccountFormSchema>();

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
                    onClick={() =>
                        onValidate(methods.getValues("document.value"))
                    }
                >
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
