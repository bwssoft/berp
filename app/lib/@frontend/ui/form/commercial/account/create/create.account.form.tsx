"use client";

import { FormProvider } from "react-hook-form";
import { useCreateAccountForm } from "./use-create.account.form";
import { DocumentAccountForm } from "./document.account.form";
import { Button, Form } from "../../../../component";
import { CpfAccountForm } from "./cpf.account.form";
import { CNPJAccountForm } from "./cnpj.account.form";
import { FakeLoadingButton } from "../../../../component/fake-load-button";
import { useRouter } from "next/navigation";

export function CreateOneAccountForm() {
  const {
    methods,
    onSubmit,
    type,
    handleCpfCnpj,
    buttonsState,
    toggleButtonText,
    setType,
    form,
    isSubmitting,
  } = useCreateAccountForm();
  const router = useRouter();

  const hasValidated = type && methods.getValues("document.type") === type;

  return (
    <FormProvider {...methods}>
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <DocumentAccountForm
            textButton={buttonsState}
            toggleButtonText={toggleButtonText}
            onValidate={handleCpfCnpj}
            resetType={() => setType(undefined)}
            type={type}
          />

          {hasValidated && type === "cpf" && <CpfAccountForm />}
          {hasValidated && type === "cnpj" && <CNPJAccountForm />}

          {hasValidated && (
            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => {
                  router.push("/commercial/account");
                }}
              >
                Cancelar
              </Button>
              <FakeLoadingButton
                variant="default"
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar e próximo"}
              </FakeLoadingButton>
            </div>
          )}
        </form>
      </Form>
    </FormProvider>
  );
}
