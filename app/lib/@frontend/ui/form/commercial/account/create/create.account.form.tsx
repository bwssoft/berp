"use client";

import { FormProvider } from "react-hook-form";
import { useCreateAccountForm } from "./use-create.account.form";
import { DocumentAccountForm } from "./document.account.form";
import { Button } from "../../../../component";
import { CpfAccountForm } from "./cpf.account.form";
import { CNPJAccountForm } from "./cnpj.account.form";
import { IAddress } from "@/app/lib/@backend/domain";
import { AddressForm } from "./address.account.form";

export function AccountCreateForm() {
    const { methods } = useCreateAccountForm();

    return (
        <FormProvider {...methods}>
            <form className="flex flex-col gap-4">
                <DocumentAccountForm />
                <CpfAccountForm />
                <CNPJAccountForm />
                <AddressForm />
                <div className="flex gap-4">
                    <Button type="button" variant="ghost">
                        Cancelar
                    </Button>
                    <Button type="button">Salvar e próximo</Button>
                </div>
            </form>
            <pre>{JSON.stringify(methods.watch(), null, 2)}</pre>
        </FormProvider>
    );
}
