"use client";

import { FormProvider } from "react-hook-form";
import { useCreateAccountForm } from "./use-create.account.form";
import { DocumentAccountForm } from "./document.account.form";
import { Button } from "../../../../component";
import { CpfAccountForm } from "./cpf.account.form";
import { CNPJAccountForm } from "./cnpj.account.form";

export function AccountCreateForm() {
    const { methods, onSubmit, type } = useCreateAccountForm();

    const hasValidated = methods.getValues("document.type") === type;

    return (
        <FormProvider {...methods}>
            <form
                className="flex flex-col gap-4"
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <h2 className="text-lg font-semibold">Registro de conta</h2>
                <p className="text-sm text-gray-500">
                    Preencha o formulário abaixo para registrar uma conta.
                </p>

                <DocumentAccountForm />

                {hasValidated && type === "cpf" && <CpfAccountForm />}
                {hasValidated && type === "cnpj" && <CNPJAccountForm />}

                <div className="flex gap-4">
                    <Button type="button" variant="ghost">
                        Cancelar
                    </Button>
                    <Button type="submit">Salvar e próximo</Button>
                </div>
            </form>
        </FormProvider>
    );
}
