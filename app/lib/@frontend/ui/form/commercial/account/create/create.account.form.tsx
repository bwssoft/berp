"use client";

import { FormProvider } from "react-hook-form";
import { useCreateAccountForm } from "./use-create.account.form";
import { DocumentAccountForm } from "./document.account.form";
import { Button } from "../../../../component";
import { CpfAccountForm } from "./cpf.account.form";
import { CNPJAccountForm } from "./cnpj.account.form";

export function AccountCreateForm() {
  const { methods, onSubmit, type, handleCpfCnpj, textButton, setTextButton } =
    useCreateAccountForm();

  const hasValidated = methods.getValues("document.type") === type;

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-4"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <DocumentAccountForm
          textButton={textButton}
          setTextButton={setTextButton}
          onValidate={handleCpfCnpj}
          type={type}
        />

        {hasValidated && type === "cpf" && <CpfAccountForm />}
        {hasValidated && type === "cnpj" && <CNPJAccountForm />}

        {hasValidated && (
          <div className="flex gap-4">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
            <Button type="submit">Salvar e próximo</Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
