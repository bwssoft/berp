"use client";

import { FormProvider } from "react-hook-form";
import { useCreateAccountForm } from "./use-create.account.form";
import { DocumentAccountForm } from "./document.account.form";
import { Button, Form } from "../../../../component";
import { CpfAccountForm } from "./cpf.account.form";
import { CNPJAccountForm } from "./cnpj.account.form";

export function AccountCreateForm() {
  const {
    methods,
    onSubmit,
    type,
    handleCpfCnpj,
    dataHolding,
    buttonsState,
    toggleButtonText,
    dataControlled,
    setSelectedControlled,
    selectedControlled,
    debouncedValidationHolding,
    debouncedValidationControlled,
    disabledFields,
    form,
  } = useCreateAccountForm();

  const hasValidated = type && methods.getValues("document.type") === type;

  return (
    <FormProvider {...methods}>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <DocumentAccountForm
            textButton={buttonsState}
            toggleButtonText={toggleButtonText}
            onValidate={handleCpfCnpj}
            type={type}
          />

          {hasValidated && type === "cpf" && <CpfAccountForm />}
          {hasValidated && type === "cnpj" && (
            <CNPJAccountForm
              dataHolding={dataHolding || []}
              setSelectedControlled={setSelectedControlled}
              selectedControlled={selectedControlled}
              dataControlled={dataControlled || []}
              debouncedValidationHolding={debouncedValidationHolding}
              debouncedValidationControlled={debouncedValidationControlled}
              disabledFields={disabledFields}
            />
          )}

          {hasValidated && (
            <div className="flex gap-4">
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
              <Button type="submit">Salvar e próximo</Button>
            </div>
          )}
        </form>
      </Form>
    </FormProvider>
  );
}
