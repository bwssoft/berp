"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Button, Input } from "../../../../component";
import { text } from "stream/consumers";

interface Props {
    onValidate: (
        documentValue: string
    ) => "cpf" | "cnpj" | "invalid" | Promise<"cpf" | "cnpj" | "invalid">;

    type: "cpf" | "cnpj" | undefined;
    textButton: string;
    setTextButton: (text: string) => void;
}

export function DocumentAccountForm({
    onValidate,
    type,
    textButton,
    setTextButton,
}: Props) {
    const methods = useFormContext<CreateAccountFormSchema>();

    return (
        <div>
            <div className="flex items-end gap-4">
                <Input
                    {...methods.register("document.value")}
                    label="CPF/CNPJ *"
                    className="w-80"
                    disabled={textButton !== "Validar"}
                    placeholder="Insira um documento para ser validado"
                    error={methods.formState.errors.document?.value?.message}
                />
                <Button
                    type="button"
                    onClick={async () => {
                        if (textButton === "Validar") {
                            const result = await onValidate(
                                methods.getValues("document.value")
                            );
                            if (type !== undefined && result !== "invalid") {
                                setTextButton("Editar");
                            }
                        } else {
                            setTextButton("Validar");
                        }
                    }}
                >
                    {textButton}
                </Button>
            </div>

            {type && (
                <Controller
                    name="document.type"
                    control={methods.control}
                    render={() => (
                        <Input
                            disabled
                            value={
                                type === "cpf"
                                    ? "Pessoa física"
                                    : "Pessoa jurídica"
                            }
                            label="Tipo de pessoa"
                        />
                    )}
                />
            )}
        </div>
    );
}
