"use client";

import { FormProvider } from "react-hook-form";
import {
  CreateAccountFormProvider,
  useCreateAccountFormContext,
} from "@/app/lib/@frontend/context/create-account-form.context";
import { DocumentAccountForm } from "./document.account.form";
import { Button } from '@/frontend/ui/component/button';
import { Form } from '@/frontend/ui/component/form';

import { CpfAccountForm } from "./cpf.account.form";
import { CNPJAccountForm } from "./cnpj.account.form";
import { FakeLoadingButton } from "../../../../component/fake-load-button";
import { useRouter } from "next/navigation";

function CreateAccountFormContent() {
  const {
    methods,
    onSubmit,
    type,
    handleCpfCnpj,
    buttonsState,
    toggleButtonText,
    setType,
    isSubmitting,
  } = useCreateAccountFormContext();
  const router = useRouter();

  const hasValidated = type && methods.getValues("document.type") === type;

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
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

export function CreateOneAccountForm() {
  return (
    <CreateAccountFormProvider>
      <CreateAccountFormContent />
    </CreateAccountFormProvider>
  );
}
